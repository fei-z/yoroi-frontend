// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TopBar from '../components/topbar/TopBar';
import WalletTopbarTitle from '../components/topbar/WalletTopbarTitle';
import type { InjectedProps } from '../types/injectedPropsType';
import environment from '../environment';

import { formattedWalletAmount } from '../utils/formatters';

type Props = InjectedProps;

@observer
export default class TopBarContainer extends Component<Props> {

  updateHideBalance = () => {
    this.props.actions.profile.updateHideBalance.trigger();
  }

  render() {
    const { actions, stores } = this.props;
    const { app, topbar, profile } = stores;

    const walletsStore = stores.substores[environment.API].wallets;
    const coinPriceStore = stores.substores[environment.API].coinPriceStore;

    const title = (<WalletTopbarTitle
      wallet={walletsStore.active}
      coinPrice={coinPriceStore}
      account={walletsStore.activeAccount}
      currentRoute={app.currentRoute}
      formattedWalletAmount={formattedWalletAmount}
      themeProperties={{
        identiconSaturationFactor: profile.isClassicTheme ? -5 : 0
      }}
      onUpdateHideBalance={this.updateHideBalance}
      shouldHideBalance={profile.shouldHideBalance}
      coinPriceCurrencySetting={profile.unitOfAccount}
    />);
    return (
      <TopBar
        title={title}
        onCategoryClicked={category => {
          actions.topbar.activateTopbarCategory.trigger({ category });
        }}
        isActiveCategory={topbar.isActiveCategory}
        categories={topbar.categories}
      />
    );
  }
}
