import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import Pincode from 'App/Models/Pincode';

export default class Pincodes extends BaseSchema {
  public async up(): Promise<void> {
    this.schema.createTable(Pincode.table, (table) => {
      table.bigInteger(Pincode.columnName('id')).primary();
      table.integer(Pincode.columnName('pincode')).unique();
      table.string(Pincode.columnName('city'), 50).notNullable().index();
      table.string(Pincode.columnName('state'), 50).notNullable().index();
      table.jsonb(Pincode.columnName('meta')).nullable();
      table.timestamps(true);
    });
  }

  public async down(): Promise<void> {
    this.schema.dropTable(Pincode.table);
  }
}