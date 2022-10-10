# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-alpha.3](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@2.0.0-alpha.2...rma-server@2.0.0-alpha.3) (2022-08-25)

### Bug Fixes

- Fixed lint issues ([77b27d5](https://gitlab.com/castlecraft/excel-rma/commit/77b27d5bffd1ea9fa57a95c8bc9309056b021533))
- Fixed Replce Product issue in warranty ([9f37f35](https://gitlab.com/castlecraft/excel-rma/commit/9f37f3527a237a0893ba8cf5e8b321de39eb259b))
- Fixed Serial no. history in Warranty ([0de24ac](https://gitlab.com/castlecraft/excel-rma/commit/0de24aca40af35bf606a0a6b0c6ecfd4b3129e93))
- Fixed Serialized Stock Entry ([2f31bc7](https://gitlab.com/castlecraft/excel-rma/commit/2f31bc72eb5308a9f05cdb19e1fa053ea184f7e8))
- Fixed stock entry return issue ([5d98380](https://gitlab.com/castlecraft/excel-rma/commit/5d98380e885e0ac4fbf6eaf011ec4ae5363c14dc))
- Fixed Stock Ledger ([7b5cda3](https://gitlab.com/castlecraft/excel-rma/commit/7b5cda3cc0dbe14a9c593a55d4478faac9a13b6c))
- Fixed warehouse issue in stock entry ([5233cc1](https://gitlab.com/castlecraft/excel-rma/commit/5233cc1cac3940ca9806ee900535309ab144cfad))
- Fixed Warranty print issue ([fb5f831](https://gitlab.com/castlecraft/excel-rma/commit/fb5f831cfa2126009ff3d76ebde5b8fde54750d0))
- Fixed Warranty Stock Entry issues ([54af64e](https://gitlab.com/castlecraft/excel-rma/commit/54af64e23a5db3d2f633ce8ad49fac54f8d1aff7))
- Fixed Warranty Stock Entry Spare Parts issue ([4d17bed](https://gitlab.com/castlecraft/excel-rma/commit/4d17bed2292cb2860cf3fc9073c8a8e39a319461))
- Fixed Warranty Stock logic ([fc3c074](https://gitlab.com/castlecraft/excel-rma/commit/fc3c07423228ce02d3569b609d88274cdef4e01f))
- Sales invoice aggregate fix ([7fba479](https://gitlab.com/castlecraft/excel-rma/commit/7fba4799a2fbe619c91fccdf11959c960cf0e952))
- **rma-pos, rma-server:** update mode of payment ([5d5b16b](https://gitlab.com/castlecraft/excel-rma/commit/5d5b16b8db62fb8bab721b37a7263c4387210756))
- **rma-server:** bypass error for cron services ([9968236](https://gitlab.com/castlecraft/excel-rma/commit/99682369f5202f3519a67d8a70e39ac53ad5761a))
- **rma-server:** fixed delivery_status and territory filters ([9860420](https://gitlab.com/castlecraft/excel-rma/commit/98604203ed3df67d7c7c15976c33ebb600aca1a8))
- **rma-server:** pull delivery_status and territory filters fix ([59746d6](https://gitlab.com/castlecraft/excel-rma/commit/59746d6fee236529f220feabbf011efae3e5786d))
- **rma-server:** remove failed job on error ([94d1c47](https://gitlab.com/castlecraft/excel-rma/commit/94d1c47ec6ad57b722a8b23fea298a63b0a6db59))
- pull warranty claim analysis report ([9659405](https://gitlab.com/castlecraft/excel-rma/commit/9659405ad81b4e8c7cc8329f167069a0b7e199e1))

### Features

- Disconnected Stock Entru from ERP ([37aee69](https://gitlab.com/castlecraft/excel-rma/commit/37aee6996710c86a7ee049ef72e7576a0caa4b95))
- **rma-pos:** added payment method on add sales invoice page ([9222c78](https://gitlab.com/castlecraft/excel-rma/commit/9222c7809435e3243b19ae7b55ca76f3f632106b))
- **rma-pos, rma-server:** sync mode of payment ([09c595b](https://gitlab.com/castlecraft/excel-rma/commit/09c595bc4e2d34b75c9537c975ac52add45a7315))

# [2.0.0-alpha.2](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@2.0.0-alpha.1...rma-server@2.0.0-alpha.2) (2022-07-17)

### Bug Fixes

- **rma-server:** Disconnect create of DeliveryNote type in ERPNext. Only create CreditNote type in ERPNext and StockLedger in MongoDB. ([95f16ef](https://gitlab.com/castlecraft/excel-rma/commit/95f16eff5e77b27953ea6ea79945bb9277890a16))
- **rma-server:** List all serials returned in a sales invoice including serial ranges. ([b62c50a](https://gitlab.com/castlecraft/excel-rma/commit/b62c50a95ae7fdff2caada44890258e1ccd13034))

# [2.0.0-alpha.1](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@2.0.0-alpha.0...rma-server@2.0.0-alpha.1) (2022-07-04)

**Note:** Version bump only for package rma-server

# [1.15.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.14.0...rma-server@1.15.0) (2021-09-07)

### Bug Fixes

- **Excel-rma:** Fix partial sales return creation for credit note items ([25cc9af](https://gitlab.com/castlecraft/excel-rma/commit/25cc9af907d43ca6c7e087361733947f9df880b0))

### Features

- **rma-frontend:** added backdated invoice control ([773ab7a](https://gitlab.com/castlecraft/excel-rma/commit/773ab7af230ed16bfc62054e60700de04a26fec6))

# [1.14.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.13.0...rma-server@1.14.0) (2021-06-12)

### Bug Fixes

- **rma-server:** Fixed create warranty stock entry ([27ad155](https://gitlab.com/castlecraft/excel-rma/commit/27ad15546532378a056f8f7b28ffcde4b014d7e1))
- **rma-server:** Replaced hardcoded strings ([5b368fd](https://gitlab.com/castlecraft/excel-rma/commit/5b368fdf1925be3da9a46a2836650387061c16cb))

### Features

- **rma-warranty:** Added filters on service invoice page ([f37fd12](https://gitlab.com/castlecraft/excel-rma/commit/f37fd1214f5987b51a9c82f9972cecf13b14a674))
- **rma-warranty:** Added Sync data button on warranty service invoice page ([2ad7cf6](https://gitlab.com/castlecraft/excel-rma/commit/2ad7cf6871abea4a1eec4c6e4de23c3af2fc1810))
- **rma-warranty:** Added Sync data button on warranty service invoice page...1 ([f649770](https://gitlab.com/castlecraft/excel-rma/commit/f6497701ec8287475e39970b78856b48393e9e12))
- **rma-warranty:** Added Sync data button on warranty service invoice page...2 ([0a75024](https://gitlab.com/castlecraft/excel-rma/commit/0a7502473c6d489476c814d8e70ea6d5e7c3b667))

# [1.13.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.12.0...rma-server@1.13.0) (2021-05-21)

### Bug Fixes

- **rma-server:** Fixed autocomplete issues on item name ([5aa8268](https://gitlab.com/castlecraft/excel-rma/commit/5aa82683ad6dad51974b23e86ca8ce419d8f0666))
- **rma-server:** fixed customer name issue on sales page ([b82c2e7](https://gitlab.com/castlecraft/excel-rma/commit/b82c2e747ffedddac7132d2a913a15e1ed9eeffe))
- **rma-server:** Fixed email error while creating sales return ([b395638](https://gitlab.com/castlecraft/excel-rma/commit/b3956389e13bca97b85c3ac2f546ed975b51080e))

### Features

- **rma-frontend and ram-server:** item search in item price make it exact search & Stock entry number search should fetch by matching values. ([3a8fa25](https://gitlab.com/castlecraft/excel-rma/commit/3a8fa2504590fee3a2461d74ebad60222092be57))
- **rma-server:** pipeline test fail fixed. ([f50d8b1](https://gitlab.com/castlecraft/excel-rma/commit/f50d8b16b3b599a154dbc24522b96a9479787a43))
- **rma:frontend:** Added Terms and Conditions Page ([9e1251a](https://gitlab.com/castlecraft/excel-rma/commit/9e1251a1cec42acfcb03805a67ad809d93a3ec20))
- **rma:frontend:** Added Terms and Conditions Page 1 ([6f32c3a](https://gitlab.com/castlecraft/excel-rma/commit/6f32c3ae3bb379600e8e011bae414d39837de498))
- **rma:frontend:** Added Terms and Conditions Page 2 ([6fff070](https://gitlab.com/castlecraft/excel-rma/commit/6fff070df5b3e0add1d4d8448e514f0a685f5877))
- **rma:frontend:** Added Terms and Conditions Page 3 ([9859bea](https://gitlab.com/castlecraft/excel-rma/commit/9859bea7dd499f17ffecf511b00abf1ef5aa15e2))

# [1.12.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.11.1...rma-server@1.12.0) (2021-04-12)

### Features

- **Excel-rma:** Add migration for thirdparty warranty ([35b5315](https://gitlab.com/castlecraft/excel-rma/commit/35b53157b0c2a943588334293a230f1ea99079eb))

## [1.11.1](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.11.0...rma-server@1.11.1) (2021-03-24)

### Bug Fixes

- **rma-server:** Claim type filters fixed on Warranty Page ([baabd4c](https://gitlab.com/castlecraft/excel-rma/commit/baabd4c42cced3f756bb470c063b2100177f64ef))
- **rma-server:** Claim type filters fixed on Warranty Page 1 ([fcb4adb](https://gitlab.com/castlecraft/excel-rma/commit/fcb4adb0b75f8be8cc175c9c24250f5045f2ead1))
- **rma-server:** Claim type filters fixed on Warranty Page 2 ([6aa7b12](https://gitlab.com/castlecraft/excel-rma/commit/6aa7b12a310c89fadf4beaae98880f3b7b053d07))
- **rma-warranty:** Filters fixed on Warranty Page ([4457d93](https://gitlab.com/castlecraft/excel-rma/commit/4457d93cda56a17e8962cd7d0cda4df4cf89fe94))

# [1.11.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.10.1...rma-server@1.11.0) (2021-03-13)

### Features

- **excel-rma:** Add migration to set default customer for material issue ([48db9fd](https://gitlab.com/castlecraft/excel-rma/commit/48db9fda04ddeeaacbc2ae88834f7dff55225b96))

## [1.10.1](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.10.0...rma-server@1.10.1) (2021-03-10)

**Note:** Version bump only for package rma-server

# [1.10.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.9.0...rma-server@1.10.0) (2021-03-09)

### Bug Fixes

- **Warranty-claim:** Fix issue with warranty claim name creation ([e7c59ba](https://gitlab.com/castlecraft/excel-rma/commit/e7c59bad310e53c72490cb071c1377666193cc19))

### Features

- **Excel-rma:** Update stock entry flow for issue and RnD ([9ded65d](https://gitlab.com/castlecraft/excel-rma/commit/9ded65d40cd96d4d7491ffb31a4848d93bd7057b))

# [1.9.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.8.0...rma-server@1.9.0) (2021-03-08)

### Bug Fixes

- **rma-warranty:** Fixed all filters on Warranty page ([361aa73](https://gitlab.com/castlecraft/excel-rma/commit/361aa7377321e30ac2030b11f9acf8a5590e262c))

### Features

- **Excel-Warranty:** Fix bugs on add warranty claim ([18af6e4](https://gitlab.com/castlecraft/excel-rma/commit/18af6e40fbfa99a3ceccc81a5f8bce7cba0df277))

# [1.8.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.7.0...rma-server@1.8.0) (2021-03-06)

### Bug Fixes

- **rma-frontend:** Delivery Chalan print fixed ([5b2dea4](https://gitlab.com/castlecraft/excel-rma/commit/5b2dea47605c268024a367cc829dd255137c97d7))
- **rma-frontend:** Delivery Chalan print fixed 1 ([0411bc3](https://gitlab.com/castlecraft/excel-rma/commit/0411bc36006aa430fc0ceb7840fa5149cc0d1ede))

### Features

- **rma-frontend:** Remarks field added to Prints ([cf2d2cc](https://gitlab.com/castlecraft/excel-rma/commit/cf2d2ccdd64eba8adbd85bbd486bbb838ade03c1))

# [1.7.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.6.2...rma-server@1.7.0) (2021-02-27)

### Features

- **rma-frontend:** Remarks field added to Sales Return ([7a72417](https://gitlab.com/castlecraft/excel-rma/commit/7a724177ec6a4410543985bc68a41805bf2d58dc))
- **Rma-server:** Update flow for stock entry batching ([5ca9769](https://gitlab.com/castlecraft/excel-rma/commit/5ca9769b1e35eaedb0dbcb88ce02d52b5a62ce2c))

## [1.6.2](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.6.1...rma-server@1.6.2) (2021-02-22)

### Bug Fixes

- **Excel-rma:** Fix file upload for stock entry ([5074c66](https://gitlab.com/castlecraft/excel-rma/commit/5074c66a308fb3cad393e6c00ce0aabebbfcd71f))

## [1.6.1](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.6.0...rma-server@1.6.1) (2021-02-21)

### Bug Fixes

- **Excel-rma:** Fix sales invoice for non stock items ([01f4ee9](https://gitlab.com/castlecraft/excel-rma/commit/01f4ee9ea431b392f5c36d4129e69de40e34c583))

# [1.6.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.5.0...rma-server@1.6.0) (2021-02-18)

### Features

- **excel-rma:** Add transaction lock for sales invoice ([3cfa0a5](https://gitlab.com/castlecraft/excel-rma/commit/3cfa0a5aebeb96602a08a1a9583d7dbf4bae2acc))
- **Excel-rma:** Add brand settings and favicon in global defaults ([7aa4c8f](https://gitlab.com/castlecraft/excel-rma/commit/7aa4c8f7f4a05ea3db72bfba7c4c46fe688d9d4a))
- **Excel-rma:** Add logic to fetch delivered serials for transfer ([87246b4](https://gitlab.com/castlecraft/excel-rma/commit/87246b44083c195ce5bcd031be4a7eef94a8c9ef))
- **Excel-rma:** Add stock item and table optimizations ([2ccfab7](https://gitlab.com/castlecraft/excel-rma/commit/2ccfab7b2d37a45d07434789d6031a281a2637df))
- **rma-frontend:** Added Delivery Status tag for Sales Invoice voucher change 4 ([60e1274](https://gitlab.com/castlecraft/excel-rma/commit/60e1274f4c94e245898ca15abef2efcbabab4440))
- **rma-frontend:** Added Delivery Status tag for Sales Invoice voucher change 5 ([25d7523](https://gitlab.com/castlecraft/excel-rma/commit/25d7523e76f23f2090d6349990d5918cbaa6cb4b))
- **rma-frontend:** Added Delivery Status tag for Sales Invoice voucher change 6 ([635f9c7](https://gitlab.com/castlecraft/excel-rma/commit/635f9c788044ea04f2b409629e5e11d2a1e55ba0))
- **rma-frontend:** Added Delivery Status tag for Sales Invoice voucher change 7 ([2f36e61](https://gitlab.com/castlecraft/excel-rma/commit/2f36e619f74d5df5022cd5caf49742c80f3f4df8))
- **rma-frontend:** Only items with is_stock_item will be displayed ([80e92e5](https://gitlab.com/castlecraft/excel-rma/commit/80e92e5a2f706f6f34c09372a941bf32e189fe3c))
- **rma-frontend:** Only items with is_stock_item will be displayed fixed ([95d0950](https://gitlab.com/castlecraft/excel-rma/commit/95d0950e8abd607fe67ab5fbd283810b9589848e))

# [1.5.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.4.0...rma-server@1.5.0) (2021-02-09)

### Features

- **Excel-rma:** Add creation time stamp migration from posting date ([b259fd3](https://gitlab.com/castlecraft/excel-rma/commit/b259fd3782fe944e4a0ea1069ab3c7c1162257b5))
- **Excel-rma:** Add territory and warehouse permission to stock ([b2cf0cd](https://gitlab.com/castlecraft/excel-rma/commit/b2cf0cd198835c1af4621972435b1030abe2882f))
- **Excel-rma:** Update permissions for backend and UI components ([493ac92](https://gitlab.com/castlecraft/excel-rma/commit/493ac92cf6a324c5abfd1421509b55ed157574df))

# [1.4.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.3.0...rma-server@1.4.0) (2021-02-03)

### Bug Fixes

- **excel-rma:** Handle different date formats for sync ([d7a4c6b](https://gitlab.com/castlecraft/excel-rma/commit/d7a4c6b8650b7e212bb7da13f09c374abb651f30))

### Features

- **excel-rma:** Add date parsing for posting date ([1dc480c](https://gitlab.com/castlecraft/excel-rma/commit/1dc480c531b666470229f8467ef3a4c1fc0b5b31))
- **rma-frontend:** Stock ID search filter fixed on Stock Entry Page ([f71e64e](https://gitlab.com/castlecraft/excel-rma/commit/f71e64ebf4b6faddce5dd5cf403e7664fa700df6))

# [1.3.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.2.2...rma-server@1.3.0) (2021-01-31)

### Features

- **excel-rma:** Add aggregated print for stock entry ([3c3cfb9](https://gitlab.com/castlecraft/excel-rma/commit/3c3cfb95b4e54a4c11fac46c6596554b0949e7d5))
- **excel-rma:** Updated sales return, job cleanup, serial date, print ([7cf98cc](https://gitlab.com/castlecraft/excel-rma/commit/7cf98ccf54da049b6b4cf280be60af08beb9fb53))
- **Excel-rma:** Validate sales return based on posting date ([3441e4a](https://gitlab.com/castlecraft/excel-rma/commit/3441e4acad2bd079706250269d95c3795979cec1))

## [1.2.2](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.2.1...rma-server@1.2.2) (2021-01-28)

### Bug Fixes

- **excel-rma:** Add fix for serial event, UI ([5735fe2](https://gitlab.com/castlecraft/excel-rma/commit/5735fe226361cbca47d10850c8f608a5611ec7e8))
- **excel-rma:** Fix print, file, webhook, item bugs ([9f05ea1](https://gitlab.com/castlecraft/excel-rma/commit/9f05ea13dbfead3bddd8c094886c6999fb1f4c83))

## [1.2.1](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.2.0...rma-server@1.2.1) (2021-01-27)

### Bug Fixes

- **excel-rma:** Add fixes for item-price, stock, webhooks ([ce7c597](https://gitlab.com/castlecraft/excel-rma/commit/ce7c597cfd14691cabd0cba66a0cfec080ada4df))

# [1.2.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.1.0...rma-server@1.2.0) (2021-01-23)

### Features

- **rma-frontend:** Single Serial search and combined Item and Warehouse search added ([78453f3](https://gitlab.com/castlecraft/excel-rma/commit/78453f3b0744493d7df7f78632dc39e85b0bbb9e))
- **rma-frontend:** Single Serial search and combined Item and Warehouse search added ([62f5a95](https://gitlab.com/castlecraft/excel-rma/commit/62f5a957089f4aae0eb5a5e38920aec1226370c9))
- **rma-warranty:** Single Serial search and combined Item and Warehouse search added ([255514b](https://gitlab.com/castlecraft/excel-rma/commit/255514bde4b8324d5afef3f8fb5c18be4ff919e0))

# [1.1.0](https://gitlab.com/castlecraft/excel-rma/compare/rma-server@1.0.0...rma-server@1.1.0) (2021-01-23)

### Features

- **excel-rma:** Serials selling backdated validation ([fd715b8](https://gitlab.com/castlecraft/excel-rma/commit/fd715b8567b15e58c60eb9b7669b4d45244064d1))
