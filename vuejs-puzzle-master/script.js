/* eslint-disable no-console */
window.onload = function () {
	Vue.component("countdown-timer", {
		data() {
			return {
				counterInSeconds: this.seconds,
				warningInSeconds: this.warningTime,
				dangerInSeconds: this.dangerTime,
				counterRunning: false,
				timerID: -1,
				noWarning: true,
				warning: false,
				dangerZone: false
			};
		},
		props: {
			seconds: {
				type: Number,
				default: 60
			},
			warningTime: {
				type: Number,
				default: 30
			},
			dangerTime: {
				type: Number,
				default: 10
			},
			run: {
				type: Boolean,
				default: false
			}
		},
		template: `<div :class="[
                    'timer',
                    {'timer-danger': dangerZone},
                    {'timer-warning': warning},
                    {'timer-normal': noWarning}, 
                    ]">
                    制限時間：    {{ this.getTime() }}
                </div>`,
		methods: {
			getTime: function () { // html から、この場合 120
				let minutes = Math.floor(this.counterInSeconds / 60);
        let seconds = this.counterInSeconds % 60;
        console.log(seconds);
				if (seconds < 10) {
					seconds = "0" + seconds;
				}

				return minutes + ":" + seconds;
			},

			startTimer: function () {
				if (!this.counterRunning) {
					this.timerID = setInterval(this.reduceTime, 1000);
					setTimeout(() => {
						clearInterval(this.timerID);
						this.$emit("out-of-time", true);
					}, this.seconds * 1000);

          this.counterRunning = true;
				}
			},

			stopTimer: function () {
				clearInterval(this.timerID);
			},

			reduceTime: function () {
				this.counterInSeconds--;
			}
		},

		watch: {
			run: function (newVal, oldVal) {
        newVal ? this.startTimer() : this.stopTimer();
			},

			counterInSeconds: function () {
				switch (this.counterInSeconds) {
					case this.warningInSeconds:
						this.warning = true;
						this.noWarning = false;
						this.dangerZone = false;
						break;
					case this.dangerInSeconds:
						this.dangerZone = true;
						this.warning = false;
						this.noWarning = false;
						break;
				}
			}
		}
	});

	Vue.component("tile-component", {
		props: ["tile"],
		template: `
            <!-- クラスは動的に変化するため、タイルの行と列とともに変化します -->
            <div :class="['tile', 'tile-' + tile.id, 'row-' + (tile.row + 1) + '-col-' + (tile.col + 1)]" 
            @click="$emit('is-adjacent')">
            </div>
            `
	});

	new Vue({
		el: "#app",
		data: {
			tiles: [
				{
					id: 1,
					row: 0,
					col: 0
				},
				{
					id: 2,
					row: 0,
					col: 1
				},
				{
					id: 3,
					row: 0,
					col: 2
				},
				{
					id: 4,
					row: 1,
					col: 0
				},
				{
					id: 5,
					row: 1,
					col: 1
				},
				{
					id: 6,
					row: 1,
					col: 2
				},
				{
					id: 7,
					row: 2,
					col: 0
				},
				{
					id: 8,
					row: 2,
					col: 1
				}
			],
			emptySlot: {
				id: 9,
				row: 2,
				col: 2
			},
			answer: [
				[5, 8, 1],
				[7, 6, 2],
				[4, 3, 9]
			],
			userAnswer: [
				[0, 0, 0],
				[0, 0, 0],
				[0, 0, 0]
			],
			playerWon: false,
			playerLoss: false,
			playerMoves: 0,
			gameRunning: false,
		},
		methods: {
			isAdjacent: function (row, col) {
				return Math.abs(row - this.emptySlot.row) + Math.abs(col - this.emptySlot.col) ===　1　
          ? true
					: false;
			},

			slideTile: function (tile) {
				if (this.isAdjacent(tile.row, tile.col)) {
					if (!this.gameRunning) {
						this.gameRunning = true;
					}

          [tile.row, tile.col, this.emptySlot.row, this.emptySlot.col] = [this.emptySlot.row, this.emptySlot.col, tile.row, tile.col ];
          this.userAnswer[tile.row][tile.col] = tile.id;
          this.userAnswer[this.emptySlot.row][this.emptySlot.col] = this.emptySlot.id; // emptyslot.id  9
					this.playerMoves++;  // 何回動かした？
					this.checkAnswer();
				}
			},

			checkAnswer: function () {
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						if (this.userAnswer[i][j] !== this.answer[i][j]) {
              // userAnswer と answer の配列チェック（id）
              // [[0][0], [0][1] , [0][2]]
              // [[1][0], [1][1] , [1][2]]
              // [[2][0], [2][1] , [2][2]]
							return;
						}
					}
				}

				this.gameRunning = false;
				this.playerWon = true;
			}
		}
	});
	
};
