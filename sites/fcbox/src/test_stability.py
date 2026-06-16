"""Verify updated captcha.py stability"""
import sys
sys.path.insert(0, '.')
from captcha import FcboxCaptchaSolver

solver = FcboxCaptchaSolver(yunma_token="tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI")

results = []
for i in range(5):
    print(f"\n{'='*40}")
    token = solver.solve()
    results.append(token is not None)
    print(f"Attempt {i+1}: {'SUCCESS' if token else 'FAIL'}")
    import time; time.sleep(0.5)

print(f"\nSuccess rate: {sum(results)}/{len(results)} = {sum(results)/len(results)*100:.0f}%")
