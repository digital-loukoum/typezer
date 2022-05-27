# Beta

### 0.9.26
- Use strict mode by default
- Typezer now loads by default the closest `tsconfig.json` relative to the first file to parse
- Use can pass a custom `tsconfig.json` file path


### 0.9.25
- Fix optional values validation (accept undefined values, not null values)

### 0.9.24
- Fix optional values validation (accept null and undefined values)

### 0.9.23
- Cleaner validator error messages

### 0.9.22
- Fix optional type of optional parameter (is now union of original type and undefined)

### 0.9.18
- Make `validate()` and `validateSignature()` throw when the path is not correct

### 0.9.17
- Fix `findPathTarget` when path is an empty array
### 0.9.16
- Use [@digitak/cute](https://www.npmjs.com/package/@digitak/cute) to stringify values (the only stringify library that does not crach with big integers 😅)
- Use NodeNext module resolution and add '.js' extension to all js/ts imports
- Remove dependency on `tsc-esm` for build

### 0.9.13
- Remove prettyjson as it is not compatible with Vite. Using JSON.stringify for now

### 0.9.12
- Remove sourcemaps (not compatible with .d.ts files)

### 0.9.12
- Export sourcemaps

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
