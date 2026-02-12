"""Solutions for message length limits."""


def limit_chars(message, limit=160):
    """Return message truncated to limit characters."""
    if len(message) <= limit:
        return message
    return message[:limit]


def limit_words(message, limit=20):
    """Optimal: split into words and keep the first limit words."""
    words = message.split()
    if len(words) <= limit:
        return message
    return " ".join(words[:limit])


def manual(message, limit=20):
    """Manual: count words by scanning characters, no split."""
    count = 0
    in_word = False
    for i, ch in enumerate(message):
        if ch.isspace():
            in_word = False
            continue
        if not in_word:
            count += 1
            if count == limit + 1:
                return message[:i].rstrip()
            in_word = True
    return message


def recursive_limit(message, limit=20):
    """Recursive: build the first limit words using recursion."""
    words = message.split()

    def helper(index, acc):
        if index >= len(words) or len(acc) == limit:
            return acc
        return helper(index + 1, acc + [words[index]])

    return " ".join(helper(0, []))


def charac(sentences):
    return sentences[:160]

def limit_words(msg,limit=20):
    return ' '.join(msg.split(maxsplit=limit)[0:limit]),' '.join(msg.split(maxsplit=limit)[limit:])

def manual(msg, limit=20):
    words=[]
    current=''

    for char in msg:
        if char.isspace():
            if current:
                words.append(current)
                current = ''
                if len(words)==limit:
                    break
        else:
            current+=char
    return ' '.join(words)

def limit_words_recursive(words, limit):
    if not words or limit == 0:
        return []
    return [words[0]] + limit_words_recursive(words[1:], limit-1)

def wrapper(text, limit=20):
    return " ".join(limit_words_recursive(text.split(), limit))

query=input('type smt:')
msg,cut=limit_words(query)
print(f'first 160 character: {charac(query)}')
print(f'msg: {msg}')
#print(f'cut words:{cut}')
