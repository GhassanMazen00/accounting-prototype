import random
import string

def generate_password(length=12, use_digits=True, use_specials=True):
    letters = string.ascii_letters
    digits = string.digits if use_digits else ""
    specials = string.punctuation if use_specials else ""

    all_chars = letters + digits + specials

    if not all_chars:
        raise ValueError("No characters selected to generate password!")

    password = ''.join(random.choice(all_chars) for _ in range(length))
    return password

if __name__ == "__main__":
    print("=== Password Generator ===")
    length = int(input("Enter password length: "))
    use_digits = input("Include digits? (y/n): ").lower() == "y"
    use_specials = input("Include special characters? (y/n): ").lower() == "y"

    print("Generated Password:", generate_password(length, use_digits, use_specials))
