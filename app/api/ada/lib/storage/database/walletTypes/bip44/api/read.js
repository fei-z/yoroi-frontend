// @flow

import type {
  lf$Database,
  lf$Transaction,
} from 'lovefield';

import type {
  Bip44WrapperRow,
} from '../tables';
import * as Tables from '../tables';

import {
  getRowFromKey,
} from '../../../utils';
import { PublicDeriverSchema, } from '../../core/tables';
import type { PublicDeriverRow, } from '../../core/tables';

export class GetBip44Wrapper {
  static ownTables = Object.freeze({
    [Tables.Bip44WrapperSchema.name]: Tables.Bip44WrapperSchema,
  });
  static depTables = Object.freeze({});

  static async get(
    db: lf$Database,
    tx: lf$Transaction,
    key: number,
  ): Promise<$ReadOnly<Bip44WrapperRow> | void> {
    return await getRowFromKey<Bip44WrapperRow>(
      db, tx,
      key,
      GetBip44Wrapper.ownTables[Tables.Bip44WrapperSchema.name].name,
      GetBip44Wrapper.ownTables[Tables.Bip44WrapperSchema.name].properties.Bip44WrapperId,
    );
  }
}

export class GetAllBip44Wallets {
  static ownTables = Object.freeze({
    [Tables.Bip44WrapperSchema.name]: Tables.Bip44WrapperSchema,
    [PublicDeriverSchema.name]: PublicDeriverSchema,
  });
  static depTables = Object.freeze({});

  static async get(
    db: lf$Database,
    tx: lf$Transaction,
  ): Promise<$ReadOnlyArray<{|
    Bip44Wrapper: $ReadOnly<Bip44WrapperRow>,
    PublicDeriver: $ReadOnly<PublicDeriverRow>,
  |}>> {
    const publicDeriverTable = db.getSchema().table(
      GetAllBip44Wallets.ownTables[PublicDeriverSchema.name].name
    );
    const bip44WrapperTable = db.getSchema().table(
      GetAllBip44Wallets.ownTables[Tables.Bip44WrapperSchema.name].name
    );
    const query = db
      .select()
      .from(bip44WrapperTable)
      .innerJoin(
        publicDeriverTable,
        publicDeriverTable[PublicDeriverSchema.properties.ConceptualWalletId].eq(
          bip44WrapperTable[PublicDeriverSchema.properties.ConceptualWalletId]
        )
      );

    return await tx.attach(query);
  }

  static async forBip44Wallet(
    db: lf$Database,
    tx: lf$Transaction,
    bip44WrapperId: number,
  ): Promise<$ReadOnlyArray<{|
    PublicDeriver: $ReadOnly<PublicDeriverRow>,
  |}>> {
    const publicDeriverTable = db.getSchema().table(
      GetAllBip44Wallets.ownTables[PublicDeriverSchema.name].name
    );
    const bip44WrapperTable = db.getSchema().table(
      GetAllBip44Wallets.ownTables[Tables.Bip44WrapperSchema.name].name
    );
    const query = db
      .select()
      .from(bip44WrapperTable)
      .where(
        bip44WrapperTable[Tables.Bip44WrapperSchema.properties.Bip44WrapperId].eq(
          bip44WrapperId
        )
      )
      .innerJoin(
        publicDeriverTable,
        publicDeriverTable[PublicDeriverSchema.properties.ConceptualWalletId].eq(
          bip44WrapperTable[PublicDeriverSchema.properties.ConceptualWalletId]
        )
      );

    return await tx.attach(query);
  }
}
