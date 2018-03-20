# AutoViewHub

TradingView strategies dont provide a mechanism to replicate the results in AutoView. Using thirdparty tools we seek to remove this boundry of entry to new traders, mostly through template inherance to create modules.

Additionally all contributers will be rewarded from donations for their strategies in accordance with the gains relative to the rest of the library. Hoping to create an Etherium smart contract when I get the time. :smiley:

# Design

Using mustache template syntax we can create module semantics in pinescript. This will allow shared code to be used between strategies, and allow costomization through configuration. Also hoping to add AutoView targets which will be added to the strategy 'modules' which will then match the backtested results.

# Getting Started

```sh
yarn # npm install
# vim ./core/config.json
npm run build:strategy
# once happy with results
npm run build:alerts
```
