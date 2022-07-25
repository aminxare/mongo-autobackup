Envoriment variables:
MONGODB_HOST:
 مقدار دامین mongodb
 مقدار پیشفرض localhost میباشد

MONGODB_PORT:
 مقدار پیشفرض 27017 میباشد

BACKUP_PATH:
 مسیر ذخیره شدن فایل backup است

 مسیر پیشفرض ./backups است

DATABASE_NAME:
 نام دیتابیسی که باید از آن backup گرفته شود
 این متغیر الزامی است

CRONEXPRESSION: 
 یک عبارت برای کران جاب که زمانبندی بک اب گیری را مشخص میکند
 https://crontab.guru/


-----------------------------------------------------

لاگ ها در دیتابیس جدول لاگ دخیره میشود

------------------------------------------------------


installation:
    
    ```bash

      npm i

    ```

run: 

    ```bash

        npm start


    ```

### How to restore backups: 

```bash

mongorestore --uri <URI> --nsInclude <DATABASENAME>.<COLLECTION-NAME> --drop --gzip --archive=<PATH-TO-BACKUP>

mongorestore --uri 'mongodb://localhost:27017' --nsInclude mydatabase.* --drop --gzip --archive='./backups/2022-07-25.archive'

```