import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Word

def save_words_to_database(file_path):
    
    if not os.path.exists(file_path):
        print(f'Error: File path {file_path} does not exist')
        return

    print('Reading text file...')
    
    with open(file_path, 'r', encoding='utf-8') as f:
        raw_words = f.read().splitlines()

    print(f"Processing {len(raw_words)} raw entries...")

    words_to_save = []
    
    for raw_word in raw_words:
        clean_word = raw_word.strip().lower()

        if 4 <= len(clean_word) <= 15 and clean_word.isalpha():
            words_to_save.append(Word(word=clean_word))

    if words_to_save:
        print(f"Saving {len(words_to_save)} to database...")
        Word.objects.bulk_create(words_to_save)
        print("Saved words to database.")

    else:
        print('Words unable to be processed')


if __name__ == '__main__':
    file_path = 'english_words.txt'
    save_words_to_database(file_path)
    