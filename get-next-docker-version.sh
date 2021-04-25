curlResult=$(curl "https://registry.hub.docker.com/v2/repositories/nilsemil/resto-order-api/tags/?page_size=1&page=1&ordering=last_updated" 2>/dev/null | jq -r '.count')
nextNumber=$(( "${curlResult//[!0-9]/}" + 1))
echo $nextNumber