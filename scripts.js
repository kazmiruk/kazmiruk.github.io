var app = angular.module('app', []);

app.controller('appController', function ($scope, $timeout) {
	var db = new PouchDB('recrubase');

	var _change_order = function(card, direction) {
		var updateBulk = [];
		card.order = card.order - direction;
		updateBulk[updateBulk.length] = card;
		$scope.cards[card.column_id][card.order].order = $scope.cards[card.column_id][card.order].order + direction;
		updateBulk[updateBulk.length] = $scope.cards[card.column_id][card.order];

		db.bulkDocs(updateBulk).then(function(response) {
			_get_cards();
		});
	}; 

	var _get_cards = function() {
		$scope.cards = [];

		for(var i = 0; i < $scope.columns.length; i++) {
			$scope.cards[i] = [];
		}

		db.allDocs({include_docs: true}).then(_prepare_cards).catch(function (err) {
			console.log(err);
		});
	};

	var _move_between_columns = function(card, direction) {
		var updateBulk = [];

		for (var i = card.order + 1; i < $scope.cards[card.column_id].length; i++) {
			var _card = $scope.cards[card.column_id][i];
			_card.order = _card.order - 1;
			updateBulk[updateBulk.length] = _card;
		}

		card.column_id = card.column_id + direction;
		card.order = $scope.cards[card.column_id].length;
		updateBulk[updateBulk.length] = card;

		db.bulkDocs(updateBulk).then(function(response) {
			_get_cards();
		});
	};

	var _prepare_cards = function(result) {
		console.log(result);
		$timeout(function() {
			for (var i in result.rows) {
				$scope.cards[result.rows[i].doc.column_id][result.rows[i].doc.order] = result.rows[i].doc;
			}
		});
	};

	$scope.addNewRow = function() {
		var first_name_el = angular.element("#first_name"),
		    last_name_el = angular.element("#last_name"),
		    age_el = angular.element("#age"),
		    city_el = angular.element("#city"),
		    avatar_el = angular.element("#avatar"),
		    first_name = first_name_el.val().trim(),
		    last_name = last_name_el.val().trim(),
		    age = age_el.val().trim(),
		    city = city_el.val().trim(),
		    avatar = avatar_el.val().trim();

		if (first_name && last_name && age && age >= age_el.attr('min') && age <= age_el.attr('max') && city) {
			var card = {
				"order": $scope.cards[0].length,
				"column_id": 0,
				"first_name": first_name,
				"last_name": last_name,
				"age": age,
				"city": city,
				"avatar": avatar || null
			};
			db.post(card).then(function(response) {
				card._id = response.id;
				card._rev = response.rev;
				$timeout(function() {
					$scope.cards[0][$scope.cards[0].length] = card;
				});
				first_name_el.val('');
				last_name_el.val('');
				age_el.val('')
				city_el.val('');
				avatar_el.val('');
				$scope.addCardShow = false;
				$scope.showError = false;
			}).catch(function (err) {
				console.log(err);
			});
		} else {
			$scope.showError = true;
		}
	};

  	$scope.init = function(columns) {
		$scope.columns = columns;
		_get_cards();
	};

	$scope.moveDown = function(card) {
		if (card.order <= $scope.cards[card.column_id].length - 2) {
			_change_order(card, -1);
		}
	};

	$scope.moveLeft = function(card) {
		if (card.column_id >= 1) {
			_move_between_columns(card, -1);
		}
	};
	
	$scope.moveRight = function(card) {
		if (card.column_id <= $scope.columns.length - 2) {
			_move_between_columns(card, 1);
		}
	};

	$scope.moveUp = function(card) {
		if (card.order >= 1) {
			_change_order(card, 1);
		}
	};
});