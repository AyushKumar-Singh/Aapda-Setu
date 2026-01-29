# Aapda Assistant - Ollama Model Setup Guide

## Quick Start

### Prerequisites
- Ollama installed ([Download](https://ollama.com/download))
- ~5GB disk space for llama3.1:8b model

---

## 1. Build the Model

```bash
# Navigate to the ollama directory
cd backend/ollama

# Pull base model first (if not already)
ollama pull llama3.1:8b

# Create custom model from Modelfile
ollama create aapda-assistant -f Modelfile
```

---

## 2. Run the Model

```bash
# Interactive chat mode
ollama run aapda-assistant

# Test with a prompt
ollama run aapda-assistant "What should I do if there's a gas leak?"
```

---

## 3. API Usage

### Basic API Call

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "aapda-assistant",
  "prompt": "What should I do during an earthquake?",
  "stream": false
}'
```

### Chat API (with history)

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "aapda-assistant",
  "messages": [
    {"role": "user", "content": "There is a fire in my building. What should I do?"}
  ],
  "stream": false
}'
```

---

## 4. Backend Integration

Update `backend/api-gateway/src/routes/chatbot.routes.ts`:

```typescript
import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

router.post('/chat', async (req, res) => {
    const { message, session_id } = req.body;
    
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
            model: 'aapda-assistant',
            messages: [{ role: 'user', content: message }],
            stream: false
        });
        
        return res.json({
            success: true,
            data: { response: response.data.message.content }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            fallback: 'Emergency: 112 | Fire: 101 | Ambulance: 108'
        });
    }
});
```

Add to `.env`:
```
OLLAMA_URL=http://localhost:11434
```

---

## 5. Model Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `temperature` | 0.3 | Low creativity, factual responses |
| `top_p` | 0.9 | Nucleus sampling for coherence |
| `top_k` | 40 | Limits vocabulary randomness |
| `num_ctx` | 4096 | Context window for conversation |
| `repeat_penalty` | 1.1 | Prevents repetitive text |

---

## Hackathon Demo Note

> ⚠️ **Important Architecture**
>
> - APK does **NOT** ship the model (too large ~5GB)
> - Model runs on **laptop/server** via Ollama
> - Flutter app → Backend API → Ollama → Response
>
> ```
> ┌──────────┐    HTTP    ┌───────────┐   HTTP   ┌────────────────┐
> │ Flutter  │ ─────────► │  Backend  │ ───────► │ Ollama Server  │
> │   App    │            │   :5000   │          │    :11434      │
> └──────────┘            └───────────┘          │ aapda-assistant│
>                                                └────────────────┘
> ```

---

## Test Prompts

Try these to verify the model works correctly:

1. `"What should I do if I smell a gas leak in my kitchen?"`
2. `"There's an earthquake happening right now. Help!"`
3. `"My neighbor's house is on fire. What steps should I take?"`
4. `"Heavy flooding in my area. Should I evacuate?"`
5. `"Someone had a road accident and is bleeding. First aid?"`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not found | Run `ollama create aapda-assistant -f Modelfile` |
| Slow responses | Ensure you have 8GB+ RAM available |
| Connection refused | Start Ollama: `ollama serve` |
| Out of memory | Use `llama3.1:8b` instead of larger variants |
