## ASAP - Academic Staff Appointment Process

### System users

All passwords: `4tOmH3aRTm0Th3r`

- django admin user: `asapadmin`
- Chair
    - `nir_keidar`
- Admin
    - `nitzan_eilon`
    - `aviram_dayan`
- Department 1
    - `rani_blair` - dept-head
    - `yael_shenkar` - member
    - `shemuel_elbaz` - member
- Department 2
    - `sharon_hadad` - dept-head
    - `gila_benisti` - member
    - `reut_magidish` - member

### DB

#### Dump data

```
### Setup env
* Client
  * Run `npm install` from `code/client/asap`
* Server
  * Install 3rd parties: `pip install -r requirements.txt`
  * Run DB script from `build/db`
  * Run migration: `python manage.py migrate`
  * Populate DB: `python manage.py loaddatautf8 core.json`
  * Copy `build/.env/.env.dev` to `code/server/src/asap` and rename it to `.env`
```
