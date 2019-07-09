import * as speechService from "./speechservice";
import * as config from "config";
import * as fs from "fs";

const getKey = () => {
  const key: string = config.get("speech_service.key");
  return key;
};

test("トークンを取得", () => {
  const key = getKey();
  return speechService.getAccessToken(key).then(data => {
    expect(data).not.toBe(0);
  });
});

test("テンプレートを返す", () => {
  const expected = fs.readFileSync("resources/test/template.xml", "utf-8");
  expect(speechService.getBody("我是中国人")).toBe(expected);
});

test("トークンを取得してから音声を取得する", async () => {
  const key = getKey();
  const token = await speechService.getAccessToken(key);
  return speechService.getAudio("我是中国人", token).then(data => {
    expect(data).not.toBe(0);
  });
});
