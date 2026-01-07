"""
FastAPI ML Service - GPU (Image Classification + Tamper Detection + LLM)
Handles image analysis using EfficientNet/Xception and Ollama integration
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
from datetime import datetime

app = FastAPI(title="Aapda Setu ML GPU Service")

# Ollama configuration
OLLAMA_URL = "http://localhost:11434"

class ImageAnalysisResponse(BaseModel):
    success: bool
    image_score: float
    classification: str
    is_tampered: bool
    is_duplicate: bool

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ml-gpu",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze image using EfficientNet/Xception
    Includes tamper detection and duplicate checking
    """
    try:
        # Read image
        image_data = await file.read()
        
        # TODO: Implement actual image classification
        # For now, return mock analysis
        
        # Mock image analysis based on file size
        file_size_kb = len(image_data) / 1024
        base_score = 0.7
        
        # Simple heuristics
        if file_size_kb > 100:
            base_score += 0.1
        if file_size_kb < 50:
            base_score -= 0.2
            
        score = max(0.3, min(base_score, 0.95))
        
        return {
            "success": True,
            "image_score": score,
            "classification": "disaster_scene" if score > 0.7 else "normal_scene",
            "confidence": score,
            "is_tampered": False,  # TODO: Implement forensics
            "is_duplicate": False,  # TODO: Implement pHash
            "file_size_kb": file_size_kb,
            "format": file.content_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_llm(request: ChatRequest):
    """
    Emergency chatbot using Ollama LLM
    """
    try:
        # Call Ollama API
        async with httpx.AsyncClient(timeout=30.0) as client:
            prompt = f"""You are an emergency response assistant for Aapda Setu, a disaster management platform in India. 
Provide helpful, concise safety information.

User: {request.message}
Assistant:"""
            
            response = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": "llama2:7b",
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "response": result.get("response", "I can help you with emergency information."),
                    "model": "llama2:7b"
                }
            else:
                # Fallback response if Ollama is not available
                return {
                    "success": True,
                    "response": "I'm an emergency assistant. For fire: Call 101. For ambulance: Call 102. For police: Call 100. Stay calm and safe.",
                    "model": "fallback"
                }
    except Exception as e:
        # Return fallback response on error
        return {
            "success": True,
            "response": "Emergency services: Fire-101, Ambulance-102, Police-100. Stay safe!",
            "model": "fallback",
            "error": str(e)
        }

@app.get("/models/status")
async def models_status():
    """Check status of GPU models and Ollama"""
    try:
        # Check Ollama
        async with httpx.AsyncClient(timeout=5.0) as client:
            ollama_response = await client.get(f"{OLLAMA_URL}/api/tags")
            ollama_status = "connected" if ollama_response.status_code == 200 else "disconnected"
    except:
        ollama_status = "disconnected"
    
    return {
        "efficientnet": "loaded",  # TODO: Check actual model
        "ollama": ollama_status,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
