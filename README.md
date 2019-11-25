# Galactic Assault
Welcome to the space-tacular battlefield! This arcade shooter pins two spaceships in head-to-head combat against aliens. There are two gamemodes: player versus player, and player versus AI.

## Database Setup
To set up the database, go to the directory containing the docker-compose.yml file

Run this command `docker-compose up -d` to build the database from the image and start it

After that, simply run `docker-compose stop` and `docker-compose start`

To go into the database, run the command `mssql -u sa -p galexy2019!`

Once in, you can run `.databases` to view all of the databases

Run `SELECT * FROM accounts.dbo.[User]` to see all of the current users

To view q_table, run ` SELECT * FROM q_table.dbo.[Move]` This can be used to select AI move 

To insert users from the commandline, run

```
EXEC accounts.dbo.uspAddUser\
          @pusername = N'Adam',\
          @ppassword = N'N00Bgamer'
```

## Gameplay
Player 1 (bottom player): A moves left, D moves right. S shoots lazers.

Player 2 (top player): J moves left, L moves right. K shoots lazers.

Earn points by shooting down enemy ships and battling your opponent.

The highest score at the end of the final round is the winner!
