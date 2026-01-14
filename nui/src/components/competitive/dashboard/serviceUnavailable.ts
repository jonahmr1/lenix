import Alert from "./alert"

export default () => {
  Alert({
    type: "warn",
    title: "Notice",
    message: "This feature is still not available yet",
    button: "Come back later",
    onClick: () => {}
  })
}