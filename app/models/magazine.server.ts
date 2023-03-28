import arc from "@architect/functions";
import cuid from "cuid";

export type Magazine = {
  id:  string;
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
  id: string;
  tag: string;
}

export type Story = {
  id:  ReturnType<typeof cuid>;
  volume: string;
  name: string;
  img: string;
  author: string;
  excerpt: string;
  url: string;
  words: number;
  pubDate: string;
  mag: Magazine['name'];
}

// create functions for magstorytag table
export async function createStoryTagST({
  tag,
  storyId,
}: StoryTag): Promise<StoryTag> {
  // story#storyId
  //  tag#tagId
  const db = await arc.tables();
  const id = cuid();
  const resultST = await db.magstorytag.put({
    pk: `story#${storyId}`,
    sk: `tag#${id}`,
    tag,
    type: 'tag',
  });

  return {
    id:  id,
    storyId: resultST.pk.replace(/^story#/, ''),
    tag
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
    pk: `mag#${id}`,
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
    id:  id,
    name: result.name,
    display: result.display,
    url: result.url,
    desc: result.desc,
    img: result.img,
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
  });
  return {
    id:  id,
    img: result.img,
    volume: result.volume,
    name: result.name,
    mag: result.mag,
    author: result.author,
    excerpt: result.excerpt,
    url: result.url,
    words: result.words,
    pubDate: result.pubDate,
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

async function queryIndexWithUniqueAttribute(partitionKey: string, sortKeyPrefix: string, uniqueAttribute: string) {
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

export async function getAllTags() {
  const tags = await queryAllByTypeUnique('tag', 'sk')
  return tags;
}

export async function getOneMag(magId: string) {
  const mag = await queryTable(`mag#${magId}`, 'meta#')
  return mag;
}

export async function getAllMagStories(magId: string) {
  const items = await queryTable(`mag#${magId}`, 'story#')
  return items;
}

export async function scan() {
  const stories = await scanIndex()
  return stories;
}

export async function getTagsByStory(tagId: string) {
  const tags = await queryIndexWithUniqueAttribute(`tag#${tagId}`, 'story#', 'sk')
  return tags;
}

export async function getStoriesByTag(storyId: string) {
  const stories = await queryTableWithUniqueAttribute(`story#${storyId}`, 'tag#', 'pk')
  return stories;
}

// export function getOneStory

// export function getOneMag *
// export function getAllMags *
// export function getAllMagStories *
// export function getAllTags *
// export function getTagsByStory *
// export function getStoriesByTag *

// export function editStory
// export function editMag

// export function removeTagFromStory
// export function deleteMag
// export function deleteStory
