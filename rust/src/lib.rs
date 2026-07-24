pub struct Player {
	pub name: String,
	pub score: i32,
}

impl Player {
	pub fn new(name: String, score: i32) -> Player {
		Player { name, score }
	}

	pub fn describe(&self) -> String {
		format!("{} has scored: {}", self.name, self.score)
	}
}