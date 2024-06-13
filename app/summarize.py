import torch
from model import tokenizer, model

def summarize(text: str) -> str:
    # 모델을 통한 요약 예측
    with torch.no_grad():
        text_input = text
        inputs = tokenizer.encode("summarize: " + text_input, return_tensors="pt", max_length=1024, truncation=True)

        # summary_ids = model.generate(inputs, max_new_tokens=20, num_beams=5, no_repeat_ngram_size=2, early_stopping=True)
        summary_ids = model.generate(inputs, max_length=150, num_beams=2, early_stopping=True)
        summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        return summary_text