# get last commit message from parent directory;
commitmessage=$(git log -1 --pretty=%B);
echo $commitmessage;

nvm use;

# BUILD THE APP
ng build --configuration=production ;

# --base-href='/orchestrate'


##  CHECK IF BUILD WAS SUCCESSFULL, CHECK IF INDEX.HTML FILE EXISTS IN NEW
## BUILD BEFORE DELETING OLD STUFF

INDEX_FILE=dist/orchestrate/index.html
if test -f "$INDEX_FILE"; then
    echo "$INDEX_FILE exists. Build was successful"



    # DELETE ALL FILES IN CURRENT PROD DIR
    cd _prod;
    rm *.js;
    rm -rf assets;
    rm *.txt;
    rm *.ico;
    rm index.html;
    rm *.css;

    # COPY FILES FROM DIST DIR;
    cp -r ../dist/orchestrate/* .;


    # set git stuff
    git add -A;
    # git commit -m "`$commitmessage`";
    git commit -m "$commitmessage"
    git push origin master;


ssh webfactor << EOF
cd ~/web/orchestrate;
git pull origin master;

echo "DONE!";
EOF

cd ..;

else 
# end build was successful
echo 'BUILD NOT SUCCESSFUL'
fi # end build was not successful


