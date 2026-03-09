fn main() {
    let mut score = 0;
    score = 10;

    let _status = if score > 5 { "win" } else { "lose" };

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

    let p = Player::new(String::from("ali"), score);
    println!("{}", p.describe())
}