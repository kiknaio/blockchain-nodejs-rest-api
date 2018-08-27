class Block {
  constructor(data) {
    this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = Date.now(),
      this.previousBlockHash = ""
  }
}

module.exports = Block;