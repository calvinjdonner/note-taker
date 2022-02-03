const express = require('express');
const { writeFile, readFile } = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path')
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static('public'))

// Get routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Post routes
app.post('/api/notes/', (req, res) => {
    const newNote = req.body;

    readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) throw err
        const noteArry = JSON.parse(data)
        
        newNote.id = noteArry.length.toString();
        noteArry.push(newNote)
        writeFile('./db/db.json', JSON.stringify(noteArry), () => {
            console.log('success')
            res.json(newNote);
        })
    })
});

// Deletes notes
app.delete('/api/notes/:id', (req, res) => {
    req.params.id
    readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err
        const notes = JSON.parse(data)
        const filteredNotes = notes.filter(note => {
            return req.params.id !== note.id
        })
        writeFile('./db/db.json', JSON.stringify(filteredNotes), () => {
            console.log('success')
            res.json(filteredNotes)
        })
    })
})

// Starts server
app.listen(PORT, () => {
console.log(`API server now on port ${PORT}!`);
})