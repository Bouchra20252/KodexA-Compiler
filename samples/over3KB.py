
def fibonacci(n):
    fib_sequence = [0, 1]
    for i in range(2, n):
        fib_sequence.append(fib_sequence[i - 1] + fib_sequence[i - 2])
    return fib_sequence

def generate_large_string():
    long_string = ""
    for i in range(1000):  
        long_string += f"Fibonacci Number {i+1}: {fibonacci(i+1)[-1]}\n"
    return long_string

with open('large_output.txt', 'w') as file:
    large_fibonacci_string = generate_large_string()
    file.write(large_fibonacci_string)
