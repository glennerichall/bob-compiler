import { expect } from "chai";
import { Document } from "../src/document.js";
import { CommentList } from "../src/comments.js";
import fs from "fs";
import { promisify } from "util";

let readFile = promisify(fs.readFile);

describe("Document", () => {
  const file = "tests/FILJ76080201-sommatif-2-1.html";
  describe("#ctor", () => {
    it("should set lang", async () => {
      const document = new Document(file);
      expect(document.lang).to.equal("html");
    });
  });

  describe("#load", () => {
    it("should load content", async () => {
      const content = await readFile(file, "utf8");
      const document = new Document(file);
      await document.load();
      expect(document.content).to.equal(content);
    });
  });

  describe("#edit", () => {
    it("should edit then call done on editor", async () => {
      const document = new Document(file);
      await document.load();
      let done = false;
      await document.edit(editor => {
        editor.done = () => {
          done = true;
        };
        return true;
      });
      expect(done).to.be.true;
    });

    it("should edit then change content", async () => {
      const document = new Document(file);
      await document.load();
      let range = { first: 3, last: 5 };
      await document.edit(editor => {
        editor.replaceRange(range, "bob");
        return true;
      });
      expect(document.content.substring(3, 6)).to.equal("bob");
    });
  });

});
