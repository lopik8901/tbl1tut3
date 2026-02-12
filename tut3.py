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
