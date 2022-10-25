import { BaseCommand } from '@adonisjs/core/build/standalone'
import Pincode from 'App/Models/Pincode';
import path from 'path';
import fs from 'fs-extra';

export default class StreamDbDefault extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'stream:db_default'

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

    const data = await Pincode.query()
      .select('*')
      .limit(2)
      .knexQuery
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
