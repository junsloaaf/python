# pip install langchain sentence-transformers faiss-cpu openai
from langchain.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import openai  # contoh pakai OpenAI untuk summarizer

# 1) Load dokumen
loader = PyPDFLoader("materi.pdf")
docs = loader.load()

# 2) Chunking
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = []
for d in docs:
    chunks += splitter.split_text(d.page_content)

# 3) Embeddings
embed_model = SentenceTransformer('all-mpnet-base-v2')  # contoh
embeddings = embed_model.encode(chunks, show_progress_bar=True)

# 4) FAISS index build
dim = embeddings.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(np.array(embeddings).astype('float32'))

# helper: retrieve top-k relevant chunks for a query (or for "summarize" we can use entire doc as query)
def retrieve(query, k=5):
    q_vec = embed_model.encode([query]).astype('float32')
    D, I = index.search(q_vec, k)
    return [chunks[i] for i in I[0]]

# 5) Summarize: ambil konteks teratas, lalu panggil LLM untuk merangkum
context = "\n\n".join(retrieve("Rangkum dokumen ini secara menyeluruh", k=6))
prompt = f"Berikan ringkasan komprehensif dari teks berikut:\n\n{context}\n\nRingkas menjadi 5-8 poin utama."
openai.api_key = "ANDA_API_KEY"
resp = openai.ChatCompletion.create(model="gpt-4o-mini", messages=[{"role":"user","content":prompt}])
print(resp['choices'][0]['message']['content'])
