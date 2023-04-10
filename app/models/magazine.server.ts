import arc from "@architect/functions";
import cuid from "cuid";

export type Magazine = {
  id?: string;
  name: string;
  display: string;
  url: string;
  desc: string;
  img: string;
}

export type StoryTag = {
  id?: string;  // 
  storyId: ReturnType<typeof cuid>; // story cuid
  tag: string;
}

export type Tag = {
  id?: string;
  tag: string;
}

export type Story = {
  id: ReturnType<typeof cuid>;
  volume: string;
  name: string;
  img: string;
  author: string;
  excerpt: string;
  url: string;
  words: number;
  pubDate: string;
  mag: Magazine['name'];
  tags: Array<string>;
}

export async function createStoryTagST({
  tag,
  storyId,
}: StoryTag): Promise<StoryTag> {
  // story#storyId
  //  tag#tag
  const db = await arc.tables();
  const id = cuid();
  const resultST = await db.magstorytag.put({
    pk: `tag#${tag}`,
    sk: `story#${storyId}`,
    tag,
    type: 'tag',
    id: id
  });

  return {
    id: id,
    storyId: resultST.pk.replace(/^story#/, ''),
    tag
  };
}

export async function createStoryST({
  img,
  volume,
  name,
  author,
  excerpt,
  url,
  words,
  pubDate,
  mag,
}: Story): Promise<Story> {
  // pk mag#magId 
  // sk story#storyId
  const db = await arc.tables();
  const id = cuid();
  const result = await db.magstorytag.put({
    pk: `mag#${mag}`,
    sk: `story#${id}`,
    img,
    volume,
    name,
    author,
    excerpt,
    url,
    words,
    pubDate,
    id: id,
    mag,
    type: 'story',
    tags: []
  });
  return {
    id: id,
    img: result.img,
    volume: result.volume,
    name: result.name,
    mag: result.mag,
    author: result.author,
    excerpt: result.excerpt,
    url: result.url,
    words: result.words,
    pubDate: result.pubDate,
    tags: result.tags,
  };
}

export async function createMagazineST({
  name,
  display,
  url,
  desc,
  img,
}: Magazine): Promise<Magazine> {
  // pk # mag#magId 
  // sk # meta#magId
  const db = await arc.tables();
  const id = cuid();
  const result = await db.magstorytag.put({
    pk: `mag#${name}`,
    sk: `meta#${id}`,
    name,
    display,
    url,
    desc,
    img,
    id: id,
    type: 'magazine',
  });
  return {
    id: id,
    name: result.name,
    display: result.display,
    url: result.url,
    desc: result.desc,
    img: result.img,
  };
}

export async function deleteStory({
  id,
  mag
}: { id: string, mag: string }) {
  const db = await arc.tables();
  await db.magstorytag.delete({
    pk: `mag#${mag}`,
    sk: `story#${id}`,
  })
}

export async function deleteStoryTag({
  storyId,
  tag
}: { storyId: string, tag: string }) {
  const db = await arc.tables();
  await db.magstorytag.delete({
    pk: `tag#${tag}`,
    sk: `story#${storyId}`,
  })
}

export async function deleteMag({
  id,
  mag
}: { id: string, mag: string }) {
  const db = await arc.tables();
  await db.magstorytag.delete({
    pk: `mag#${mag}`,
    sk: `meta#${id}`,
  })
}

export async function updateStoryST({
  id,
  img,
  volume,
  name,
  author,
  excerpt,
  url,
  words,
  pubDate,
  mag,
  tags,
}: Story) {
  const db = await arc.tables();
  db.magstorytag.update({
    Key: {
      pk: `mag#${mag}`,
      sk: `story#${id}`,
    },
    UpdateExpression: 'SET #id = :id, #img = :img, #volume = :volume, #name = :name, #author = :author, #excerpt = :excerpt, #url = :url, #words = :words, #pubDate = :pubDate, #mag = :mag, #tags = :tags',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#img': 'img',
      '#volume': 'volume',
      '#name': 'name',
      '#author': 'author',
      '#excerpt': 'excerpt',
      '#url': 'url',
      '#words': 'words',
      '#pubDate': 'pubDate',
      '#mag': 'mag',
      '#tags': 'tags',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':img': img,
      ':volume': volume,
      ':name': name,
      ':author': author,
      ':excerpt': excerpt,
      ':url': url,
      ':words': words,
      ':pubDate': pubDate,
      ':mag': mag,
      ':tags': tags,
    },
  });
}

export async function updateMagST({
  id,
  img,
  desc,
  name,
  display,
  url,
}: Magazine) {
  const db = await arc.tables();
  db.magstorytag.update({
    Key: {
      pk: `mag#${name}`,
      sk: `meta#${id}`,
    },
    UpdateExpression: 'SET #id = :id, #img = :img, #name = :name, #url = :url, #desc = :desc, #display = :display',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#img': 'img',
      '#desc': 'desc',
      '#name': 'name',
      '#display': 'display',
      '#url': 'url',
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':img': img,
      ':desc': desc,
      ':name': name,
      ':display': display,
      ':url': url,
    }
  });
}

export async function createTagST({
  tag,
}: Tag): Promise<Tag> {
  // pk tag#tag 
  // sk meta#tagId
  const db = await arc.tables();
  const id = cuid();
  const result = await db.magstorytag.put({
    pk: `tag#${tag}`,
    sk: `meta#${id}`,
    tag,
    type: 'tag',
  });
  return {
    id: id,
    tag: result.tag,
  };
}

async function queryTable(partitionKey: string, sortKeyPrefix: string) {
  const data = await arc.tables()
  const result = await data['magstorytag'].query({
    KeyConditionExpression: '#partitionKey = :partitionKey and begins_with(#sortKey, :sortKeyPrefix)',
    ExpressionAttributeNames: {
      '#partitionKey': 'pk',
      '#sortKey': 'sk'
    },
    ExpressionAttributeValues: {
      ':partitionKey': partitionKey,
      ':sortKeyPrefix': sortKeyPrefix
    }
  })
  return result.Items
}

async function queryIndex(partitionKey: string, sortKeyPrefix: string) {
  const data = await arc.tables()
  const result = await data['magstorytag'].query({
    IndexName: 'tagstories',
    KeyConditionExpression: '#partitionKey = :partitionKey and begins_with(#sortKey, :sortKeyPrefix)',
    ExpressionAttributeNames: {
      '#partitionKey': 'sk',
      '#sortKey': 'pk'
    },
    ExpressionAttributeValues: {
      ':partitionKey': partitionKey,
      ':sortKeyPrefix': sortKeyPrefix
    }
  })
  return result.Items
}

async function scanIndex() {
  const data = await arc.tables()
  const result = await data['magstorytag'].scan({})
  return result.Items
}

async function queryAllByTypeUnique(partitionKey: string, uniqueAttribute: string) {
  const data = await arc.tables()
  const result = await data['magstorytag'].query({
    IndexName: 'byType',
    KeyConditionExpression: '#partitionKey = :partitionKey',
    ExpressionAttributeNames: {
      '#partitionKey': 'type'
    },
    ExpressionAttributeValues: {
      ':partitionKey': partitionKey
    }
  })

  const uniqueValues = new Set()
  const uniqueItems = result.Items.filter(item => {
    if (uniqueValues.has(item[uniqueAttribute])) {
      return false
    } else {
      uniqueValues.add(item[uniqueAttribute])
      return true
    }
  })

  return uniqueItems
}

export async function getAllMags() {
  const mags = await queryAllByTypeUnique('magazine', 'sk')
  return mags;
}

export async function getAllStories() {
  const stories = await queryAllByTypeUnique('story', 'sk')
  return stories;
}

export async function getAllTags() {
  const tags = await queryAllByTypeUnique('tag', 'tag')
  return tags;
}

export async function getOneMag(magId: string | undefined) {
  const mag = await queryTable(`mag#${magId}`, 'meta#') as unknown as Magazine[]
  return mag[0];
}

export async function getOneStory(storyId: string | undefined): Promise<Story> {
  const st = await queryIndex(`story#${storyId}`, 'mag#') as unknown as Story[];
  return st[0];
}

export async function getAllMagStories(mag: string) {
  const items = await queryTable(`mag#${mag}`, 'story#')
  return items;
}

export async function scan() {
  const stories = await scanIndex()
  return stories;
}

export async function getStoriesByTag(tagId: string | undefined) {
  const stories = await queryTableWithUniqueAttribute(`tag#${tagId}`, 'story#', 'pk')
  return stories;
}

async function queryTableWithUniqueAttribute(partitionKey: string, sortKeyPrefix: string, uniqueAttribute: string) {
  const data = await arc.tables()
  const result = await data['magstorytag'].query({
    KeyConditionExpression: '#partitionKey = :partitionKey and begins_with(#sortKey, :sortKeyPrefix)',
    ExpressionAttributeNames: {
      '#partitionKey': 'pk',
      '#sortKey': 'sk'
    },
    ExpressionAttributeValues: {
      ':partitionKey': partitionKey,
      ':sortKeyPrefix': sortKeyPrefix
    }
  })

  const uniqueValues = new Set()
  const uniqueItems = result.Items.filter(item => {
    if (uniqueValues.has(item[uniqueAttribute])) {
      return false
    } else {
      uniqueValues.add(item[uniqueAttribute])
      return true
    }
  })

  return uniqueItems
}

export async function queryIndexWithUniqueAttribute(partitionKey: string, sortKeyPrefix: string, uniqueAttribute: string) {
  const data = await arc.tables()

  const result = await data['magstorytag'].query({
    IndexName: 'tagstories',
    KeyConditionExpression: '#partitionKey = :partitionKey and begins_with(#sortKey, :sortKeyPrefix)',
    ExpressionAttributeNames: {
      '#partitionKey': 'sk',
      '#sortKey': 'pk'
    },
    ExpressionAttributeValues: {
      ':partitionKey': partitionKey,
      ':sortKeyPrefix': sortKeyPrefix
    }
  })

  const uniqueValues = new Set()
  const uniqueItems = result.Items.filter(item => {
    if (uniqueValues.has(item[uniqueAttribute])) {
      return false
    } else {
      uniqueValues.add(item[uniqueAttribute])
      return true
    }
  })

  return uniqueItems
}