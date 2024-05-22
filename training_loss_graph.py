import json
import matplotlib.pyplot as plt

# Load data from JSON file
file_path = 'tmp/240521_500_50_8_8_100_1/training_metrics.json'
with open(file_path, 'r') as file:
    data = json.load(file)

# Extract steps and losses
steps = [entry['step'] for entry in data]
losses = [entry['loss'] for entry in data]

# Plot the data
plt.figure(figsize=(10, 6))
plt.plot(steps, losses, marker='o', linestyle='-', color='b')
plt.title('Training Loss Over Steps')
plt.xlabel('Step')
plt.ylabel('Loss')
plt.grid(True)
plt.savefig('tmp/240521_500_50_8_8_100_1/training_metrics.png')
plt.show()
