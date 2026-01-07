import pytest
from fastapi.testclient import TestClient
from app.main import app
import io

client = TestClient(app)

class TestTextAnalysis:
    """Test text classification endpoint"""
    
    def test_health_check(self):
        """Test health endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_text_analysis_success(self):
        """Test successful text analysis"""
        payload = {
            "text": "Fire emergency at building near station",
            "report_id": "test_rpt_001",
            "metadata": {}
        }
        
        response = client.post("/analyze/text", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] == True
        assert "text_score" in data
        assert "classification" in data
        assert 0 <= data["text_score"] <= 1
    
    def test_text_analysis_with_keywords(self):
        """Test text with emergency keywords gets higher score"""
        payload = {
            "text": "URGENT: Fire and flood emergency help needed immediately!",
            "report_id": "test_rpt_002"
        }
        
        response = client.post("/analyze/text", json=payload)
        data = response.json()
        
        # Should have higher confidence due to keywords
        assert data["text_score"] > 0.7
    
    def test_text_analysis_missing_text(self):
        """Test error handling for missing text"""
        payload = {
            "report_id": "test_rpt_003"
        }
        
        response = client.post("/analyze/text", json=payload)
        assert response.status_code == 422  # Validation error

class TestFusionModel:
    """Test fusion model endpoint"""
    
    def test_fusion_analysis(self):
        """Test fusion model combining scores"""
        payload = {
            "text_score": 0.85,
            "image_score": 0.78,
            "metadata_features": {
                "has_media": 1,
                "text_length": 150
            }
        }
        
        response = client.post("/analyze/fusion", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] == True
        assert "fusion_score" in data
        assert 0 <= data["fusion_score"] <= 1
        assert "should_verify" in data
        assert "priority" in data
    
    def test_fusion_high_confidence(self):
        """Test high confidence scores"""
        payload = {
            "text_score": 0.95,
            "image_score": 0.92,
            "metadata_features": {"has_media": 1}
        }
        
        response = client.post("/analyze/fusion", json=payload)
        data = response.json()
        
        assert data["fusion_score"] > 0.8
        assert data["should_verify"] == False
        assert data["priority"] == "high"
    
    def test_fusion_low_confidence(self):
        """Test low confidence scores require verification"""
        payload = {
            "text_score": 0.45,
            "image_score": 0.50,
            "metadata_features": {}
        }
        
        response = client.post("/analyze/fusion", json=payload)
        data = response.json()
        
        assert data["should_verify"] == True

class TestModelsStatus:
    """Test model status endpoints"""
    
    def test_models_loaded(self):
        """Test models status check"""
        response = client.get("/models/status")
        assert response.status_code == 200
        data = response.json()
        
        assert "distilbert" in data
        assert "lightgbm" in data
        assert data["distilbert"] == "loaded"
        assert data["lightgbm"] == "loaded"

class TestPerformance:
    """Performance and latency tests"""
    
    def test_text_analysis_latency(self):
        """Test text analysis completes within time limit"""
        import time
        
        payload = {
            "text": "Emergency situation requiring immediate assistance",
            "report_id": "perf_test_001"
        }
        
        start = time.time()
        response = client.post("/analyze/text", json=payload)
        duration = time.time() - start
        
        assert response.status_code == 200
        assert duration < 2.0  # Should complete within 2 seconds
    
    def test_batch_requests(self):
        """Test handling multiple concurrent requests"""
        payloads = [
            {"text": f"Test report {i}", "report_id": f"batch_{i}"}
            for i in range(10)
        ]
        
        responses = [client.post("/analyze/text", json=p) for p in payloads]
        
        assert all(r.status_code == 200 for r in responses)
        assert all(r.json()["success"] for r in responses)

# Run with: pytest -v tests/test_ml_cpu.py
