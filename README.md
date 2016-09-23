# Word of the Day

### Setup

Create a Wordnik account and get an API token.

Clone the repo:

```bash
git clone 
```

Install the dependencies:

```bash
npm install
```

### Run it

```bash
SLACK_CHANNEL=<SLACK_CHANNEL> \
SLACK_WEBHOOK=<SLACK_WEBHOOK> \
WORDNIK_TOKEN=<WORDNIK_TOKEN> \
node index.js
```

### Add it as a cronjob

```bash
crontab -e
```
Then add:

```bash
00 08 * * * SLACK_CHANNEL=<SLACK_CHANNEL> SLACK_WEBHOOK=<SLACK_WEBHOOK> WORDNIK_TOKEN=<WORDNIK_TOKEN> node index.js
```
