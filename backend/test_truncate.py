from auth import truncate_password

# Test with long password
pw = 'a' * 200
truncated = truncate_password(pw)
print(f'Original: {len(pw)} chars, {len(pw.encode("utf-8"))} bytes')
print(f'Truncated: {len(truncated)} chars, {len(truncated.encode("utf-8"))} bytes')

# Test with UTF-8 multibyte characters
pw2 = '你好' * 50  # Chinese characters, 3 bytes each
truncated2 = truncate_password(pw2)
print(f'\nUTF-8 Original: {len(pw2)} chars, {len(pw2.encode("utf-8"))} bytes')
print(f'UTF-8 Truncated: {len(truncated2)} chars, {len(truncated2.encode("utf-8"))} bytes')
