import pandas as pd
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
from tqdm import tqdm
# 학습된 모델 경로
model_path = "app/model/summary_model_500_50_8_8_200_1"

# 토크나이저 및 모델 로드
tokenizer = T5Tokenizer.from_pretrained(model_path, legacy=False)
model = T5ForConditionalGeneration.from_pretrained(model_path)

# 데이터 불러오기
input_file = 'data/test_data_50.csv'
data = pd.read_csv(input_file)

# 예측 요약을 저장할 리스트
summaries = []

# 각 행에 대해 요약 예측 수행
total_rows = len(data)
for index, row in tqdm(data.iterrows(), total= total_rows):
    text_input = row['text']
    inputs = tokenizer.encode("summarize: " + text_input, return_tensors="pt", max_length=1024, truncation=True)

    # 모델을 통한 요약 예측
    with torch.no_grad():
        summary_ids = model.generate(inputs, max_new_tokens=20, num_beams=5, no_repeat_ngram_size=2, early_stopping=True)
        # summary_ids = model.generate(inputs, max_new_tokens=20, do_sample=True, no_repeat_ngram_size=2, top_p=0.92, top_k=0, early_stopping=True)

    # 요약 텍스트로 디코딩
    summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    # 예측 요약을 리스트에 추가
    summaries.append(summary_text)

    # # 진행 상황 출력
    # if (index + 1) % 10 == 0 or (index + 1) == total_rows:
    #     print(f"Processed {index + 1}/{total_rows} rows")

# 새로운 열 'predicted_summary' 추가
data['predicted_summary'] = summaries

# 결과를 새로운 CSV 파일로 저장
output_file = 'app/model/summary_model_500_50_8_8_200_1/test_data_with_summaries_bs3_ns2.csv'
data.to_csv(output_file, index=False)

print(f"Summaries saved to {output_file}")
