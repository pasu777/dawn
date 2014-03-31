// magic video http://songshuhui.net/archives/86008

var cardPieceSize = 7;
var chip = cardPieceSize - 1;
var blue = new Array(cardPieceSize + 1).join(',').split('').map(function (a,i) {return 'blue_'+i;});
var red = new Array(cardPieceSize + 1).join(',').split('').map(function (a,i) {return 'red_'+i;});
var cards = [].concat(blue).concat(red);
function step1(n) {
  var _tmp = cards.splice(n);
  cards.unshift.apply(cards,_tmp);
}
function step2 (left) {
  cards.left = cards.left || cards.slice(0,cardPieceSize).reverse();
  cards.right = cards.right || cards.slice(cardPieceSize);
  cards.result = cards.result || [];
  if (!cards.left.length && !cards.right.length) {
    console.log('游戏结束，看看结果吧~');
    console.log(JSON.stringify(cards.result,'', 4));
    return ;
  }
  var right = chip - left;
  if (left < 0 || right < 0) {
    console.log('请切分你的筹码！你有%s个筹码，请你选择切分情况~',chip);
    return ;
  }
  chip -= 1;
  var _leftTmp = cards.left.splice(left);
  cards.left.unshift.apply(cards.left,_leftTmp);
  var _rightTmp = cards.right.splice(right);
  cards.right.unshift.apply(cards.right,_rightTmp);
  cards.result.push({
    left:cards.left.shift(),
    right:cards.right.shift()
  });
  if (chip) {
    console.log('您有%s个筹码,剩余%s个可以切分~, 本次切分左侧%s个，右侧%s个', chip + 1, chip < 0 ? 0 : chip, left, right);
  }
}
step1(1);
step1(3);
step1(2);
step1(6);
step1(9);
step1(2);
step1(4);
step1(5);
var loopLen = cardPieceSize + 2;
while(--loopLen) {
  step2((Math.random() * (loopLen - 2)) | 0);
}