from transformers import T5ForConditionalGeneration, T5Tokenizer

model_path = "model/summary_model_500_50_8_8_200_1"
tokenizer = T5Tokenizer.from_pretrained(model_path, legacy=False)
model = T5ForConditionalGeneration.from_pretrained(model_path)