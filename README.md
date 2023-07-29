# Comfortable Anonfiles API
A simple anonfiles API wrapper for everything it offers.

## Usage

Uploading
```ts
import anon from "anonfiles-api"
import { createReadStream } from "fs"

const response = anon.upload(createReadStream("fireball.mp4")); // or you can put buffers in it.

```

Getting info
```ts
const response = anon.info("0129049328")
```

### Tiny Notes
Yes, I am branding everything I make as "comfortable".