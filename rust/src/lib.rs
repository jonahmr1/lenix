struct Player {
	name: String,
	score: i32,
}

impl Player {
	fn new(name: String, score: i32) -> Player {
		Player { name, score }
	}

	fn describe(&self) -> String {
		format!("{} has scored: {}", self.name, self.score)
	}
}

fn main() {
	let score: i32 = 10;
	let _status: &str = if score > 5 { "win" } else { "lose" };

	let player: Player = Player::new(String::from("Lenix"), score);
	println!("{}", player.describe());
}
