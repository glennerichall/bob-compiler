import { expect } from 'chai';
import { Document } from '../src/document.js';
import { CommentList} from '../src/comments.js';
import fs from 'fs';
import {promisify} from 'util';

let readFile = promisify(fs.readFile);

describe('Document', () => {
  describe('#init', () => {
    it('should parse comments', async () => {
        let content = await readFile('tests/commentaires');
        //let document = new Document('commentaires');
    });
  });
});
