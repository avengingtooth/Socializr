// Set up environment
require("dotenv").config();

// ℹ️ Connects to the database
const mongoose = require("../db");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Tag = require('../models/Tag.model');
const Post = require('../models/Post.model');
const PostLike = require('../models/PostLike.model');
const Follow = require("../models/Follow.model");
const Comment = require('../models/Comment.model');
const CommentLike = require('../models/CommentLike.model');

const users = [
    {
        username: 'commander_vimes',
        firstName: 'Samuel',
        lastName: 'Vimes',
        email: 'vimes@citywatch.gov',
        password: 'qwertyu',
        profilePictureURL: 'https://res.cloudinary.com/dmbdo5peg/image/upload/c_limit,w_200/v1/iron-social/pxmyzwjpsb8ryigxmyvq',
    },
    {
        username: 'carrot',
        firstName: 'Carrot',
        lastName: 'Ironfoundersson',
        email: 'captaincarrot@citywatch.gov',
        password: '123456',
        profilePictureURL: 'https://res.cloudinary.com/dmbdo5peg/image/upload/c_limit,w_200/v1/iron-social/l3w8rtzelaltabcuipce',
    }, {
        username: 'patrician',
        firstName: 'Havelock',
        lastName: 'Vetinari',
        email: 'patrician@ankh-morpork.com',
        password: 'lajdghengdoe83jas@#$seda!@#ad',
        profilePictureURL: 'https://res.cloudinary.com/dmbdo5peg/image/upload/c_limit,w_200/v1/iron-social/bdqrxkxi0hr3ptt7bcej',
    }, 
    {
        username: 'granny',
        firstName: 'Esme',
        lastName: 'Weatherwax',
        email: 'grannyweatherwax@lancre.dw',
        password: 'password',
        profilePictureURL: 'https://res.cloudinary.com/dmbdo5peg/image/upload/c_limit,w_200/v1/iron-social/whsajsw8wo2mgy2ricor',
    },
    {
        username: 'nannyogg',
        firstName: 'Gytha',
        lastName: 'Ogg',
        email: 'nannyogg@lancre.dw',
        password: 'Hedgehog',
        profilePictureURL: 'https://res.cloudinary.com/dmbdo5peg/image/upload/c_limit,w_200/v1/iron-social/pixc9bs91jcw06zerrkt',
    },
    {
        username: 'mottschi',
        firstName: 'Sebastian',
        lastName: 'Mottschall',
        email: 'basti@ironhack.com',
        password: '123456',
        profilePictureURL: 'https://res.cloudinary.com/dmbdo5peg/image/upload/c_limit,w_200/v1/iron-social/kuo3j8kdkcv9myfyk7ay',
    },
    {
        username: 'emma',
        firstName: 'Emmanuelle',
        lastName: 'Sellin',
        email: 'emma@ironhack.com',
        password: '123456',
    },
    {
        username: 'Tweety',
        firstName: 'Tweety',
        lastName: 'Bird',
        email: 'tweety@looney-tunes.com',
        password: '123456',
        profilePictureURL: 'https://res.cloudinary.com/dmbdo5peg/image/upload/c_limit,w_200/v1/iron-social/pd59rf6osbfurkhwi2f3',
    }
]

const posts = [
    {
        author: 'granny',
        title: 'Witchery',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce elementum orci ac metus varius, at vestibulum tellus lobortis. Curabitur placerat magna arcu, quis bibendum mauris tempus ac. In porttitor ultricies nisi, ut laoreet felis egestas vitae. Proin at metus libero. Donec at ipsum nisi. Aenean sed mauris id enim tincidunt lobortis. Sed molestie molestie diam nec dictum. Fusce luctus imperdiet elit vitae tincidunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus rutrum auctor quam sed scelerisque. Praesent dolor massa, tincidunt eu volutpat vitae, fermentum vitae est. Vestibulum et metus in nibh porta suscipit. Duis elementum pulvinar dolor sit amet ultricies. Sed scelerisque, augue nec molestie cursus, est magna euismod tortor, non rutrum elit turpis ultricies mauris. Curabitur quis lacus non sem pharetra consequat.',
        tags: ['witches', 'discworld'],
    },
    {
        author: 'carrot',
        title: 'Last Nights Arrests',
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        tags: ['guard', 'ankh-morpork', 'arrests'],
    },
    {
        author: 'carrot',
        title: 'Guard Shift Schedule',
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
        tags: ['guard', 'ankh-morpork', 'shifts'],
    },
    {
        author: 'mottschi',
        title: 'Lorem Ipsum Blablabla',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras varius eget mi ac aliquet. Duis sed erat lacinia, tristique lectus nec, bibendum augue. Sed ultrices feugiat ultricies. Proin eget pulvinar tortor. Proin et arcu est. Nam dapibus accumsan erat id cursus. Aliquam erat volutpat. Nam elementum, felis faucibus aliquet auctor, nisi quam finibus eros, vitae mollis purus odio gravida augue.',
        tags: ['lorem', 'ipsum'],
    },
    {
        author: 'mottschi',
        title: 'More Lorem Ipsum Fun Facts',
        content: 'Sed congue nisi sit amet vestibulum maximus. Quisque massa lectus, porta id sollicitudin interdum, dignissim ac urna. Sed non mauris rutrum, varius enim sodales, egestas lacus. Nunc vulputate risus ac viverra finibus. Phasellus tristique dictum nibh. Aliquam eleifend dolor sit amet dignissim ultrices. Vestibulum viverra at justo sed ultricies. Suspendisse volutpat at libero a varius. Integer ligula urna, aliquet id volutpat ac, feugiat sed nulla. Donec congue lectus mauris, quis tincidunt quam pulvinar sed. Mauris lacus metus, gravida in vulputate nec, convallis vel neque. Nunc condimentum finibus ornare. Proin vitae sollicitudin risus, quis aliquet lectus. Phasellus lacus velit, porta eu porta et, aliquet et enim. Donec sodales mollis ligula quis tincidunt. ',
        tags: ['lorem', 'ipsum'],
    },
    {
        author: 'emma',
        title: 'To be updated',
        content: 'Fun random stuff here',
        tags: ['random']
    },
    {
        author: 'carrot',
        title: "Warning: Don't buy any sausages from Cut-my-own-throat-dibbler!",
        content: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
        tags: ['guard', 'ankh-morpork', 'shades', 'market'],
    },
    {
        author: 'nannyogg',
        title: 'Hedgehog Song',
        content: `A severely perverted Ephebian sage,
        Abandoned all hope, and flew into a rage.
        He had tried every creature, the great and the small,
        But the hedgehog can never be buggered at all.
    
        For a sheep, best try Lancre; when in Klatch, match a camel
        Genuese laws permit almost every mammal
        The Sto plains have sprouts (now, that's sick. What's your call?)
        And the Hedgehog...
    
        It's great fun with a bunny, if you don't mind the queue
        And a hamster can teach you a hot thing or two,
        For a bush baby's come-to-bed eyes we all fall,
        But the hedgehog...
    
        You can bandit a bison or shirt-lift a lemming
        No need for discretion, though folk are condemning
        When molesting a marmoset, stand proud and tall,
        But the hedgehog...
    
        Try mating a mongoose, or prodding a panda,
        Or ramming a male sheep, or goosing a gander.
        When passing the zoo, come in one, come in all,
        But the hedgehog...`,
        tags: ['witches', 'song', 'hedgehog', 'drinking']
    },
    {
        author: 'Tweety',
        title: "chirp chirp!",
        content: `Tweety is a yellow canary in the Warner Bros. Looney Tunes and Merrie Melodies series of animated cartoons. The name "Tweety" is a play on words, as it originally meant "sweetie", along with "tweet" being an English onomatopoeia for the sounds of birds. His characteristics are based on Red Skelton's famous "Junior the Mean Widdle Kid." He appeared in 46 cartoons during the golden age, made between 1942 and 1964. `,
        tags: ['tweety', 'looney', 'tunes', 'cartoon'],
    }
]

const comments = [
    'Your father smells of elderberries!',
    'Your mother was a hamster!',
    'This is the END for you, you gutter-crawling cur!',
    "Soon you'll be wearing my sword like a shish kebab!",
    'People fall at my feet when they see me coming.',
    'I once owned a dog that was smarter then you.',
    'You fight like a dairy farmer.',
    "I'm not going to take your insolence sitting down!",
    "I've spoken with apes more polite then you.",
    "I've heard you were a contemptible sneak.",
    "Too bad no one's ever heard of YOU at all.",
]

const userMap = new Map();
const postSet = new Set();
const commentSet = new Set();

async function seed() {
    // Drop previous data
    await Promise.all([User.deleteMany(),
        Post.deleteMany(),
        PostLike.deleteMany(),
        Tag.deleteMany(),
        Follow.deleteMany(),
        Comment.deleteMany(),
        CommentLike.deleteMany(),]
    )

    // Seed users
    for (const user of users) {
        const password = user.password;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        const generatedUser = await User.create(user);
        userMap.set(generatedUser.username, generatedUser);
    }

    // seed posts and corresponding tags
    for (const post of posts) {
        const user = userMap.get(post.author);
        const tags = [];
        for (const tagName of post.tags) {
            const tag = await Tag.findOneAndUpdate({name: tagName}, {name: tagName}, {new: true, upsert: true})
            tags.push(tag)
        }
        post.author = user;
        post.tags = tags;
        const newPost = await Post.create(post);
        postSet.add(newPost);
    }

    // seed follows - unlike previous seeds, follows are generated randomly each time seed is run
    for (const user of userMap.values()) {
        for (const other of userMap.values()) {
            // users don't follow themselves
            if (user._id.equals(other._id)) {
                continue;
            }

            // users have 60% chance to follow other users
            if (Math.random() < 0.6) {
                const follow = await Follow.create({
                    follower: user,
                    followedUser: other
                })
            }
        }
    }

    // post likes - again, seeding randomly, every user will randomly like some posts (but not their own)
    for (const user of userMap.values()) {
        for (const post of postSet) {
            if (post.author._id.equals(user._id)) {
                // console.log(`${user.username} skips over their own post '${post.title}`);
                continue;
            }

            if (Math.random() < 0.2) {
                const postLike = await PostLike.create({user: user, post: post});
            }
        }
    }

    // comments - again, randomly, and users can even comment their own posts
    for (const user of userMap.values()) {
        for (const post of postSet) {
            if (Math.random() < 0.35) {
                const content = comments[Math.floor(Math.random() * comments.length)];
                const comment = await Comment.create({author: user, post: post, content: content});
                commentSet.add(comment);
            }
        }
    }

    // comment likes
    for (const user of userMap.values()) {
        for (const comment of commentSet) {
            if (comment.author._id.equals(user._id)) {
                continue;
            }
            if (Math.random() < 0.4) {
                await CommentLike.create({user: user, comment: comment});
            }
        }
    }


    mongoose.connection.close();
}

seed();
