import { DateTime } from 'luxon';
import { BaseModel, column, ModelAttributes } from '@ioc:Adonis/Lucid/Orm';
import { mapKeys } from 'lodash';

export type PincodeType = typeof Pincode;
export default class Pincode extends BaseModel {
  public static table = 'tbl_pincodes';

  public get disableAuditLog(): boolean {
    return true;
  }

  @column()
  public pincode: number;

  @column()
  public city: string;

  @column()
  public state: string;

  @column()
  public meta: any;
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async mapColumns(
    data: Record<string, unknown>,
    model: PincodeType,
  ): Promise<Record<string, unknown>> {
    const ModelClass = (await import(`./${model.constructor.name}`)).default;
    return mapKeys(data, (_value, key) => {
      return ModelClass.$getColumn(key).columnName;
    });
  }
  public static columnName<M extends PincodeType, MA extends ModelAttributes<InstanceType<M>>>(
    this: M,
    name: keyof MA,
  ): string {
    return this.$getColumn(name as string)?.columnName || (name as string);
  }
}
