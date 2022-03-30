# Beta

### 0.9.11
- Do not use `object-inspect` package that does not run with Vite

### 0.9.10
- Export Typezer types
- No more "/library" needed to access subpackage files
- Delete unused `expression` type

### 0.9.9
- Reset raw declarations when watching

### 0.9.8
- Fix files watching: also watch dependencies
- Fix type of schema in `Typezer.watch()` 

### 0.9.7
- Validators can accept a record of type as schema (instead of a record of declaration, which was not necessary)

### 0.9.6
- Strict priority and include root type when walking through base types to make sure that all class members are captured
