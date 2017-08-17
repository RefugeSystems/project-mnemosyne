
describe("General Algorithm Calculation", function() {

	var Algorithm, algorithm;
	var mock;

	beforeEach(function() {
		Algorithm = requireSubject("algorithms/general");
	});

	describe("Inheritence", function() {
		beforeEach(function() {
			algorithm = new Algorithm("test");
		});

		it("Exists", function() {
			expect(algorithm).toBeDefined();
		});

		it("Has a first function", function() {
			expect(algorithm.first).toBeDefined();
		});

		it("Has a points function", function() {
			expect(algorithm.points).toBeDefined();
		});

		it("Has a duration function", function() {
			expect(algorithm.duration).toBeDefined();
		});

		it("Has a process function", function() {
			expect(algorithm.process).toBeDefined();
		});
	});

	describe("Options and Data", function() {
		beforeEach(function() {
			mock = 1000 * 60 * 60 * 24 * 14;
			algorithm = new Algorithm("test", {
				points: 10,
				duration: mock,
				first: 1
			});
		});

		it("Returns the correct point value", function() {
			expect(algorithm.points()).toBe(10);
		});

		it("Returns the correct duration", function() {
			expect(algorithm.duration()).toBe(mock);
		});

		it("Returns the correct first day for the sprint", function() {
			expect(algorithm.first()).toBe(1);
		});
	});

	describe("Processing", function() {

		beforeEach(function() {
			var issues = [];
			for(var x=0; x<10; x++) {
				issues.push({
					"key": "JAS-" + x,
					"points": 5
				});
			}
			mock = {
				issues: [],
				lookup: [],
				keys: []
			};

			issues.forEach(function(issue) {
				mock.issues.push(issue);
				mock.lookup[issue.key] = issue;
				mock.keys.push(issue.key);
			});


			algorithm = new Algorithm("test", {
				points: 10,
				duration: 1000 * 60 * 60 * 24 * 14,
				first: 1
			});
		});

		it("Processes a simple board", function() {
			algorithm.process(mock)
				.then(function(board) {
					expect(board).toBeDefined();
					expect(board.issues).toBeDefined();
					expect(board.lookup).toBeDefined();
					expect(board.keys).toBeDefined();
				})
				.catch(function(exception) {
					console.log(exception, "\n", exception.stack);
					fail("Error while processing board");
				});
		});
	});
});
