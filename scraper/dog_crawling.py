from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from pymysql import connect
from db_env import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
from multiprocessing import Pool, Manager

import requests
import time
import random
import logging
import logging.config
import logging.handlers
import warnings


class Crawling:
    def __init__(self):
        self.post_list = []
        self.url_num_tuple = []
        manager = Manager()
        self.content_tuple = manager.list()

    def execute(self, page, cnt) -> None:
        self.get_post_list(page)
        self.insert_post_list()

        for _ in range(cnt // 5):
            pool = Pool(processes=5)
            tmp = []
            for _ in range(5):
                if self.url_num_tuple:
                    tmp.append(self.url_num_tuple.pop())
            pool.map(self.get_content, tmp)
            pool.close()
            pool.join()
        self.update_content()

    def connect_to_db(self) -> connect:
        conn = connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            db=DB_NAME,
            charset="utf8",
        )
        return conn

    def get_post_list(self, page) -> None:
        base_url = "https://www.dogdrip.net/dogdrip?sort_index=popular&page="
        try:
            reqUrl = requests.get(
                base_url + str(page),
                headers={
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
                },
            )

            soup = BeautifulSoup(
                reqUrl.content.decode("utf-8", "replace"), "html.parser"
            )

            soup = soup.find("tbody")
            for i in soup.find_all("tr"):
                num = i.find("a", "ed link-reset")["href"].split("?")[0][9:]

                url = "https://www.dogdrip.net//dogdrip/" + num

                title = i.find("span", "ed title-link").text.strip()

                replyNum = i.find("span", "ed text-primary").text.strip()

                timeString = i.find("td", "time").text.strip()

                if timeString[-1] == "전":
                    now = datetime.now().replace(microsecond=0)
                    if timeString[-3] == "일":
                        timeValue = now - timedelta(days=float(timeString[:-4]))
                    elif timeString[-3] == "간":
                        timeValue = now - timedelta(hours=float(timeString[:-5]))
                    elif timeString[-3] == "분":
                        timeValue = now - timedelta(minutes=float(timeString[:-4]))
                else:
                    timeValue = datetime.strptime(timeString, "%Y.%m.%d")

                voteNum = i.find("td", "ed voteNum text-primary").text.strip()

                self.post_list.append(
                    (
                        num,
                        url,
                        title,
                        replyNum,
                        voteNum,
                        timeValue.strftime("%Y-%m-%d %H:%M:%S"),
                        url,
                        title,
                        replyNum,
                        voteNum,
                        timeValue.strftime("%Y-%m-%d %H:%M:%S"),
                    )
                )
                self.url_num_tuple.append((url, num))

        except Exception as e:
            logging.error(f"Failed to crawl post_list: {str(e)}")

        finally:
            logging.debug(f"{len(self.post_list)} Posts Crawled")

    def get_content(self, url_num) -> None:
        url, num = url_num
        time.sleep(random.randint(2, 3))
        try:
            reqUrl = requests.get(
                url,
                headers={
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
                },
            )

            soup = BeautifulSoup(
                reqUrl.content.decode("utf-8", "replace"), "html.parser"
            )
            content_element = soup.find("div", id="article_1")

            content_text = content_element.text.strip()
            transTable = ["\xa0", " ", "\n"]
            for s in transTable:
                content_text = content_text.replace(s, "")

            content_img = content_element.find_all("img")

            self.content_tuple.append((len(content_text), len(content_img), num))

        except Exception as e:
            logging.error(f"Failed to get content: {str(e)}")
            logging.error(f'Site: "DOG" Url: {url}')

    def insert_post_list(self) -> None:
        try:
            insert_post_list_sql = "INSERT INTO crawler_table (site, num, url, title, replyNum, voteNum, timeUpload) VALUES ('DOG', %s, %s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE url = %s, title = %s, replyNum = %s, voteNum = %s, timeUpload = %s"
            conn = self.connect_to_db()
            cursor = conn.cursor()
            cursor.executemany(insert_post_list_sql, self.post_list)

        except Exception as e:
            logging.error(f"Failed to insert post_list: {str(e)}")
            with open("dog_post.txt", "a", encoding="utf8") as file:
                for post in self.post_list:
                    file.writelines(", ".join(post))
                    file.write("\n")

        finally:
            conn.commit()
            conn.close()
            logging.debug("Post_list Inserted")

    def update_content(self) -> None:
        try:
            update_content_sql = "UPDATE crawler_table SET len = %s, imgCount = %s WHERE site = 'DOG' AND num = %s"
            conn = self.connect_to_db()
            cursor = conn.cursor()
            cursor.executemany(update_content_sql, self.content_tuple)

        except Exception as e:
            logging.error(f"Failed to update content: {str(e)}")
            with open("dog_post.txt", "a", encoding="utf8") as file:
                for post in self.content_tuple:
                    file.writelines(", ".join(post))
                    file.write("\n")

        finally:
            conn.commit()
            conn.close()
            logging.debug("Content Updated")


if __name__ == "__main__":
    warnings.filterwarnings("ignore", category=DeprecationWarning)
    config = {
        "version": 1,
        "formatters": {
            "complex": {
                "format": "%(asctime)s %(levelname)s [%(filename)s:%(lineno)d] - %(message)s"
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "complex",
                "level": "DEBUG",
            },
            "file": {
                "class": "logging.FileHandler",
                "filename": "dog_error.log",
                "formatter": "complex",
                "encoding": "utf-8",
                "level": "ERROR",
            },
        },
        "root": {"handlers": ["console", "file"], "level": "DEBUG"},
    }
    logging.config.dictConfig(config)
    root_logger = logging.getLogger()

    c = Crawling()
    start = time.time()
    c.execute(page=1, cnt=20)
    end = time.time()
    logging.debug(f"{(end - start):.1f}s")
