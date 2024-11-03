import { Random } from '@woowacourse/mission-utils';
import BonusLotto from '../BonusLotto.js';
import MONEY_UNIT from '../constants/lottoStandard.js';
import Lotto from '../Lotto.js';
import Money from '../Money.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import Rank from '../Rank.js';
import Profit from '../Profit.js';
import RankCounter from '../RankCounter.js';

class LottoController {
  async run() {
    const { lottoMoney, userLotto, winningLottoNumbers, winningLottoBonusNumber } =
      await this.prepareLotto();

    const rankCounter = this.playLotto(userLotto, winningLottoNumbers, winningLottoBonusNumber);

    this.completeLotto(lottoMoney, rankCounter);
  }

  async prepareLotto() {
    const { lottoMoney, userLotto } = await this.generateUserLotto();
    const { winningLottoNumbers, winningLottoBonusNumber } = await this.generateWinningLotto();

    return {
      lottoMoney,
      userLotto,
      winningLottoNumbers,
      winningLottoBonusNumber,
    };
  }

  playLotto(userLotto, winningLottoNumbers, winningLottoBonusNumber) {
    const rankCounter = new RankCounter();
    userLotto.forEach((lotto) => {
      const rank = new Rank(
        winningLottoNumbers.getNumbers(),
        winningLottoBonusNumber.getBonusNumber(),
        lotto,
      );

      rankCounter.increaseRankCounter(rank.getRank());
    });
    return rankCounter.getRankCounterArray();
  }

  completeLotto(lottoMoney, rankCounter) {
    const profit = new Profit(lottoMoney.getMoney(), rankCounter);
    OutputView.printLottoStatics(rankCounter, profit.getProfit());
  }

  async generateUserLotto() {
    const lottoMoney = await this.generateMoney();
    const lottoCount = this.generateLottoCount(lottoMoney);
    const userLotto = this.generateRandomLotto(lottoCount);
    return { lottoMoney, userLotto };
  }

  async generateWinningLotto() {
    const winningLottoNumbers = await this.generateWinningLottoNumbers();
    const winningLottoBonusNumber = await this.generateWinningLottoBonusNumber(winningLottoNumbers);
    return { winningLottoNumbers, winningLottoBonusNumber };
  }

  async generateMoney() {
    let lottoMoney;
    let lottoMoneyRepeater = true;
    while (lottoMoneyRepeater) {
      try {
        const inputMoney = await InputView.readMoney();
        lottoMoney = new Money(inputMoney);
        lottoMoneyRepeater = false;
      } catch (error) {
        OutputView.printErrorMessage(error.message);
      }
    }
    return lottoMoney;
  }

  async generateWinningLottoNumbers() {
    let winningLotto;
    let winningLottoRepeater = true;
    while (winningLottoRepeater) {
      try {
        const winningNumbers = await InputView.readWinningNumbers();
        winningLotto = new Lotto(winningNumbers.split(','));
        winningLottoRepeater = false;
      } catch (error) {
        OutputView.printErrorMessage(error.message);
      }
    }
    return winningLotto;
  }

  async generateWinningLottoBonusNumber(winningLotto) {
    let bonusLotto;
    let bonusLottoRepeater = true;
    while (bonusLottoRepeater) {
      try {
        const bonusNumber = await InputView.readBonusNumber();
        bonusLotto = new BonusLotto(winningLotto.getNumbers(), bonusNumber);
        bonusLottoRepeater = false;
      } catch (error) {
        OutputView.printErrorMessage(error.message);
      }
    }
    return bonusLotto;
  }

  generateLottoCount(lottoMoney) {
    const lottoCount = lottoMoney.getMoney() / MONEY_UNIT;
    OutputView.printLottoCounter(lottoCount);
    return lottoCount;
  }

  generateRandomLotto(lottoCounter) {
    const lottoList = [];
    for (let i = 0; i < lottoCounter; i++) {
      const lotto = new Lotto(Random.pickUniqueNumbersInRange(1, 45, 6));
      lottoList.push(lotto.getNumbers());
      OutputView.printLottoNumbers(lotto);
    }
    return lottoList;
  }
}

export default LottoController;
