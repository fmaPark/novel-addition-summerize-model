import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

# 학습된 모델 경로
model_path = "./tmp/240516_200_20_16_16_100_1"

# 토크나이저 및 모델 로드
tokenizer = T5Tokenizer.from_pretrained(model_path, legacy=False)
model = T5ForConditionalGeneration.from_pretrained(model_path)

# 예측할 텍스트 입력
text_input = " 그러나, 지금 옥매로서는 과연 이 지경에까지 이르렀을지. 석구와 옥매 사 이에는 과연 참사랑의 더운 피가 통하였는지?[ADDED] 이것은 미상불 의문이지마는 아마도 그토록까지는 되지 않았을 것 같다. 원래 두 사람 사이에는 참사랑 이 통할 수가 없는 처지요, 석구와 옥매도 그러한 줄은 알고 지내던 터인 즉, 비록 서로 공경하고 서로 흠앙하였을지라도 그동안에 참사랑 뜨거운 열 정이 왕래한 일은 적은 듯하다. 이것이 지금 두 사람의 처지에 대하여는 오히려 다행한 일인지도 알 수 없 다. 만일 옥매로 하여금 석구를 사랑하는 생각이 철저하여 석구를 의지하지 않으면 살 수가 없다고 생각하였던들 지금 석구의 편지를 보고 곧 실성도 하였을 것이요, 생명까지도 내어 버렸을지는 알 수 없다. 그러나, 비록 그들의 사랑이 깊지는 못하고 그들의 이상이 철저치는 못하 지마는 하여간 사랑하는 연인이라고 할 수 밖에 없다. 그러므로 옥매나 석구가 실성을 한다든지 세상을 비관하여 생명을 버리기 까지는 아니하였지마는 또한 슬퍼하고 고통하기를 마지 않았다. 이 세상 사람의 인정이란 누구든지 그러하겠지마는 비록 자기에게는 가망 밖의 일이라도 만일 자기의 뜻한 바와 같이될 듯하다가 실패를 당하면 분 하고 애석한 마음이 생기는 것이다. 그런즉 석구가 옥매의 연인이 된다 함 은 실로 옥매가 꿈에도 생각지 않던 일이지마는 석구의 편에서 먼저 이같은 뜻을 표하게 되니 옥매도 미상불 거절하고 단념하기 어려웠다. 그러다 지금 이와 같은 비참한 경우를 당하고 보니 옥매의 슬퍼함도 결코 무리한 일이 아니다. [/ADDED]"

# 텍스트 입력을 토큰화
inputs = tokenizer.encode("summarize: " + text_input, return_tensors="pt", max_length=1024, truncation=True)

# 모델을 통한 요약 예측
with torch.no_grad():
    summary_ids = model.generate(inputs, max_length=150, num_beams=2, early_stopping=True)

# 요약 텍스트로 디코딩
summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# 결과 출력
print("Original Text:", text_input)
print("Predicted Summary:", summary_text)
