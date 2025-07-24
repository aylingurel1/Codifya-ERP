-- Mevcut "TL" değerlerini "TRY" olarak güncelle
UPDATE BankTransaction SET currency = 'TRY' WHERE currency = 'TL';
UPDATE BankAccount SET currency = 'TRY' WHERE currency = 'TL';
