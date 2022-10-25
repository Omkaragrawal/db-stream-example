import { BaseCommand } from '@adonisjs/core/build/standalone'
import Pincode from 'App/Models/Pincode';
import fs from 'fs-extra';
import knex from 'knex';
import path from 'path';
import Env from '@ioc:Adonis/Core/Env';

export default class StreamDbKnexjs extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'stream:db_knexjs'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run(): Promise<void> {
    const filePath = path.join(__dirname, '..', 'temp.txt');

    fs.ensureFileSync(filePath);
    console.log(fs.existsSync(filePath));
    const file = fs.createWriteStream(filePath, { flags: 'a+' });

    const db = knex({
      debug: true,
      client: 'pg',
      connection: {
        host: Env.get('PG_HOST', '127.0.0.1'),
        port: Env.get('PG_PORT', 5432),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD'),
        database: Env.get('PG_DB_NAME'),
        ssl: {
          rejectUnauthorized: false,
        }
      },
      jsonbSupport: true,
      asyncStackTraces: true,
    });

    const data = await db
      .select('*')
      .from(Pincode.table)
      .limit(2)
      // console.log(data.toQuery());

      // console.log(await data.limit(2));
      .stream((stream) => {
        console.log('into stream');
        // Actual consoled output stream
        console.log(stream);
        stream.on('close', () => {
          console.log('closed');
          console.log({ stream });
        });
        stream.on('data', () => {
          console.log('Stream started');
        });
        stream.pipe(file);
      });

    console.log({ data });
  }
}
